const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

async function getFullUser(req) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findById(decoded.id).select('-password');
  } catch { return null; }
}

// GET /api/applications/my - job seeker's applications
router.get('/applications/my', async (req, res) => {
  try {
    const user = await getFullUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required.' });

    const applications = await Application.find({ applicantId: user._id })
      .populate('jobId', 'title company location type status salary')
      .sort({ appliedAt: -1 });

    res.json({ success: true, applications });
  } catch (err) {
    console.error('[GET /applications/my]', err.message);
    res.status(500).json({ error: 'Could not fetch applications.' });
  }
});

// GET /api/applicants - recruiters see applicants to their jobs
router.get('/applicants', async (req, res) => {
  try {
    const user = await getFullUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required.' });

    const jobs = await Job.find({ postedBy: user._id });
    const jobIds = jobs.map(j => j._id);

    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate('applicantId', 'name email phone location')
      .populate('jobId', 'title location type')
      .sort({ appliedAt: -1 });

    res.json({ success: true, applications });
  } catch (err) {
    console.error('[GET /applicants]', err.message);
    res.status(500).json({ error: 'Could not fetch applicants.' });
  }
});

// PATCH /api/applications/:id/status - update application status
router.patch('/applications/:id/status', async (req, res) => {
  try {
    const user = await getFullUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required.' });

    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ error: 'Application not found.' });

    const job = await Job.findById(app.jobId);
    if (!job || String(job.postedBy) !== String(user._id)) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    app.status = status;
    await app.save();

    // Notify applicant via SMS
    const applicant = await User.findById(app.applicantId);
    if (applicant && applicant.phone) {
      const { sendSMS } = require('../services/smsService');
      try {
        const msg = status === 'accepted'
          ? `Good news! Your application for "${job.title}" has been accepted. Contact the employer for next steps.`
          : `Your application for "${job.title}" was not accepted. Keep looking - more jobs are available!`;
        await sendSMS(applicant.phone, msg);
      } catch (smsErr) {
        console.log('[SMS status] Non-blocking error:', smsErr.message);
      }
    }

    // Notify applicant via email
    if (applicant && applicant.email) {
      const { sendEmail } = require('../services/emailService');
      try {
        const subject = status === 'accepted' ? 'Application Accepted 🎉' : 'Application Update';
        const body = status === 'accepted'
          ? `Hi ${applicant.name},\n\nGreat news! Your application for "${job.title}" at ${job.company || job.location} has been accepted!\n\nPlease contact the employer for next steps.\n\nBest regards,\nNexova Team`
          : `Hi ${applicant.name},\n\nThank you for your interest in "${job.title}" at ${job.company || job.location}. Unfortunately, your application was not selected this time.\n\nKeep applying - more jobs are available!\n\nBest regards,\nNexova Team`;
        await sendEmail(applicant.email, subject, body);
      } catch (emailErr) {
        console.log('[Email status] Non-blocking error:', emailErr.message);
      }
    }

    res.json({ success: true, message: `Application ${status}.` });
  } catch (err) {
    console.error('[PATCH /applications/:id/status]', err.message);
    res.status(500).json({ error: 'Could not update application.' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendSMS } = require('../services/smsService');
const { sendEmail } = require('../services/emailService');

function getUser(req) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch { return null; }
}

async function getFullUser(req) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findById(decoded.id).select('-password');
  } catch { return null; }
}

// GET /api/jobs
router.get('/jobs', async (req, res) => {
  try {
    const { search, type, category } = req.query;
    let query = { status: 'open' };
    if (type) query.type = type;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title:    new RegExp(search, 'i') },
        { location: new RegExp(search, 'i') },
        { company:  new RegExp(search, 'i') },
      ];
    }
    const jobs = await Job.find(query).populate('postedBy', 'name company').sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs.' });
  }
});

// GET /api/jobs/my — recruiter's own posted jobs
router.get('/jobs/my', async (req, res) => {
  try {
    const user = await getFullUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required.' });
    const jobs = await Job.find({ postedBy: user._id }).sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your jobs.' });
  }
});

// GET /api/jobs/saved — saved jobs (MUST be before /:id)
router.get('/jobs/saved', async (req, res) => {
  try {
    const user = await getFullUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required.' });

    const jobs = await Job.find({ _id: { $in: user.savedJobs }, status: 'open' })
      .populate('postedBy', 'name company').sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch saved jobs.' });
  }
});

// GET /api/jobs/:id
router.get('/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name company email');
    if (!job) return res.status(404).json({ error: 'Job not found.' });
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch job.' });
  }
});

// POST /api/jobs — post a new job
router.post('/jobs', async (req, res) => {
  try {
    const user = await getFullUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required.' });
    if (user.role !== 'recruiter') return res.status(403).json({ error: 'Only recruiters can post jobs.' });

    const { title, company, description, location, salary, type, category } = req.body;
    if (!title || !description || !location) {
      return res.status(400).json({ error: 'Title, description, and location are required.' });
    }

    const job = await Job.create({
      title, company: company || '', description, location,
      salary: salary || '', type: type || 'Full-time',
      category: category || 'Labour',
      postedBy: user._id,
    });

    // Notify jobseekers
    try {
      const seekers = await User.find({ role: 'jobseeker' });
      for (const seeker of seekers) {
        if (seeker.phone) {
          await sendSMS(seeker.phone, `New job: ${title} at ${company || 'a company'}. Location: ${location}. Apply now on Nexova!`);
        }
      }
    } catch (e) { console.log('[SMS notify]', e.message); }

    res.status(201).json({ success: true, message: 'Job posted successfully!', job });
  } catch (err) {
    res.status(500).json({ error: 'Failed to post job.' });
  }
});

// POST /api/jobs/:id/quick-apply — one-click apply (no form)
router.post('/jobs/:id/quick-apply', async (req, res) => {
  try {
    const user = await getFullUser(req);
    if (!user) return res.status(401).json({ error: 'Please login to apply.' });
    if (!user.emailVerified) return res.status(403).json({ error: 'Please verify your email before applying.' });

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found.' });
    if (job.status !== 'open') return res.status(400).json({ error: 'This job is no longer accepting applications.' });
    if (String(job.postedBy) === String(user._id)) {
      return res.status(400).json({ error: 'You cannot apply to your own job.' });
    }

    const existing = await Application.findOne({ jobId: job._id, applicantId: user._id });
    if (existing) return res.status(400).json({ error: 'You have already applied to this job.' });

    await Application.create({ jobId: job._id, applicantId: user._id, status: 'pending' });

    // Email to applicant
    try {
      if (user.email) {
        await sendEmail(
          user.email,
          `✅ Application Submitted: ${job.title}`,
          `Hi ${user.name},\n\nYour application for "${job.title}" at ${job.company || job.location} has been submitted!\n\nWe will notify you when the employer responds.\n\nBest regards,\nNexova Team`
        );
      }
    } catch (e) { console.log('[Email applicant]', e.message); }

    // Email to recruiter
    try {
      const poster = await User.findById(job.postedBy);
      if (poster?.email) {
        await sendEmail(
          poster.email,
          `📋 New Applicant: ${job.title}`,
          `Hi ${poster.name},\n\n${user.name} has applied for "${job.title}".\n\nCheck your dashboard.\n\nBest regards,\nNexova Team`
        );
      }
    } catch (e) { console.log('[Email poster]', e.message); }

    res.status(201).json({ success: true, message: `Applied! Confirmation sent to your email.` });
  } catch (err) {
    res.status(500).json({ error: 'Could not submit application.' });
  }
});

// POST /api/jobs/:id/apply
router.post('/jobs/:id/apply', async (req, res) => {
  try {
    const user = await getFullUser(req);
    if (!user) return res.status(401).json({ error: 'Please login to apply.' });
    if (!user.emailVerified) return res.status(403).json({ error: 'Please verify your email before applying. Check your inbox for the verification code.' });

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found.' });
    if (job.status !== 'open') return res.status(400).json({ error: 'This job is no longer accepting applications.' });
    if (String(job.postedBy) === String(user._id)) {
      return res.status(400).json({ error: 'You cannot apply to your own job.' });
    }

    const existing = await Application.findOne({ jobId: job._id, applicantId: user._id });
    if (existing) return res.status(400).json({ error: 'You have already applied to this job.' });

    await Application.create({ jobId: job._id, applicantId: user._id });

    // Email to applicant
    try {
      if (user.email) {
        await sendEmail(
          user.email,
          `✅ Application Submitted: ${job.title}`,
          `Hi ${user.name},\n\nYour application for "${job.title}" at ${job.company || job.location} has been submitted!\n\nWe will notify you when the employer responds.\n\nBest regards,\nNexova Team`
        );
      }
    } catch (e) { console.log('[Email applicant]', e.message); }

    // Email to recruiter
    try {
      const poster = await User.findById(job.postedBy);
      if (poster?.email) {
        await sendEmail(
          poster.email,
          `📋 New Applicant: ${job.title}`,
          `Hi ${poster.name},\n\n${user.name} has applied for "${job.title}".\n\nName: ${user.name}\nEmail: ${user.email}\nPhone: ${user.phone || 'Not provided'}\n\nCheck your dashboard.\n\nBest regards,\nNexova Team`
        );
      }
    } catch (e) { console.log('[Email poster]', e.message); }

    res.status(201).json({ success: true, message: `Application submitted! Confirmation sent to ${user.email}.` });
  } catch (err) {
    res.status(500).json({ error: 'Could not submit application.' });
  }
});

// PATCH /api/jobs/:id/close
router.patch('/jobs/:id/close', async (req, res) => {
  try {
    const user = await getFullUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required.' });

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found.' });
    if (String(job.postedBy) !== String(user._id)) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    job.status = 'closed';
    await job.save();
    res.json({ success: true, message: 'Job closed.' });
  } catch (err) {
    res.status(500).json({ error: 'Could not close job.' });
  }
});

// ✅ GET /api/applications/my — jobseeker sees their own applications
router.get('/applications/my', async (req, res) => {
  try {
    const user = await getFullUser(req);
    if (!user) return res.status(401).json({ error: 'Please login.' });

    const applications = await Application.find({ applicantId: user._id })
      .populate('jobId', 'title company location type salary status')
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications.' });
  }
});

// ✅ GET /api/applicants — recruiter sees all applicants for their jobs
router.get('/applicants', async (req, res) => {
  try {
    const user = await getFullUser(req);
    if (!user) return res.status(401).json({ error: 'Please login.' });

    const myJobs = await Job.find({ postedBy: user._id });
    const jobIds = myJobs.map(j => j._id);

    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate('applicantId', 'name email phone selfie selfieVerified emailVerified')
      .populate('jobId', 'title company location')
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applicants.' });
  }
});

// ✅ PATCH /api/applications/:id/status — accept or reject applicant
router.patch('/applications/:id/status', async (req, res) => {
  try {
    const user = await getFullUser(req);
    if (!user) return res.status(401).json({ error: 'Please login.' });

    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be accepted or rejected.' });
    }

    const app = await Application.findById(req.params.id)
      .populate('applicantId', 'name email phone')
      .populate('jobId', 'title company');

    if (!app) return res.status(404).json({ error: 'Application not found.' });

    const job = await Job.findById(app.jobId);
    if (String(job.postedBy) !== String(user._id)) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    app.status = status;
    await app.save();

    // Email applicant about decision
    try {
      if (app.applicantId?.email) {
        const subject = status === 'accepted'
          ? `🎉 Congratulations! Application Accepted: ${app.jobId?.title}`
          : `Application Update: ${app.jobId?.title}`;
        const body = status === 'accepted'
          ? `Hi ${app.applicantId.name},\n\n🎉 Congratulations! Your application for "${app.jobId?.title}" has been ACCEPTED!\n\nThe employer will contact you soon.\n\nBest regards,\nNexova Team`
          : `Hi ${app.applicantId.name},\n\nThank you for applying for "${app.jobId?.title}". Unfortunately you were not selected this time.\n\nKeep applying — new jobs are posted daily!\n\nBest regards,\nNexova Team`;
        await sendEmail(app.applicantId.email, subject, body);
      }
    } catch (e) { console.log('[Email status]', e.message); }

    res.json({ success: true, message: `Application ${status}.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update application.' });
  }
});

// ✅ DELETE /api/applications/:id — withdraw application
router.delete('/applications/:id', async (req, res) => {
  try {
    const user = await getFullUser(req);
    if (!user) return res.status(401).json({ error: 'Please login.' });

    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ error: 'Application not found.' });
    if (String(app.applicantId) !== String(user._id)) {
      return res.status(403).json({ error: 'Not your application.' });
    }
    if (app.status !== 'pending') {
      return res.status(400).json({ error: 'Cannot withdraw an accepted or rejected application.' });
    }

    await Application.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Application withdrawn successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Could not withdraw application.' });
  }
});

// POST /api/jobs/:id/save — save/bookmark a job
router.post('/jobs/:id/save', async (req, res) => {
  try {
    const user = await getFullUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required.' });

    const jobId = req.params.id;
    if (user.savedJobs.includes(jobId)) {
      return res.json({ message: 'Already saved.', saved: true });
    }

    user.savedJobs.push(jobId);
    await user.save();
    res.json({ message: 'Job saved!', saved: true });
  } catch (err) {
    res.status(500).json({ error: 'Could not save job.' });
  }
});

// DELETE /api/jobs/:id/save — unsave a job
router.delete('/jobs/:id/save', async (req, res) => {
  try {
    const user = await getFullUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required.' });

    const jobId = req.params.id;
    user.savedJobs = user.savedJobs.filter(id => String(id) !== jobId);
    await user.save();
    res.json({ message: 'Job removed from saved.', saved: false });
  } catch (err) {
    res.status(500).json({ error: 'Could not unsave job.' });
  }
});

module.exports = router;
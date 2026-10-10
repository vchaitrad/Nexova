const { isConnected, JobMem, AppMem } = require('../config/db');
const Job = require('../models/Job');
const Application = require('../models/Application');

const getJM = () => isConnected() ? Job : JobMem;
const getAM = () => isConnected() ? Application : AppMem;

exports.apply = async (req, res) => {
  try {
    const JM = getJM(); const AM = getAM();
    const job = await JM.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found.' });
    if (job.status !== 'open') return res.status(400).json({ error: 'This job is no longer accepting applications.' });
    if (String(job.postedBy) === String(req.user._id)) return res.status(400).json({ error: 'You cannot apply to your own job.' });
    const existing = await AM.findOne({ jobId: job._id, applicantId: req.user._id });
    if (existing) return res.status(400).json({ error: 'You have already applied to this job.' });
    await AM.create({ jobId: job._id, applicantId: req.user._id, coverLetter: req.body.coverLetter || '' });
    res.status(201).json({ message: 'Application submitted successfully.' });
  } catch (err) { res.status(500).json({ error: 'Could not submit application.' }); }
};

exports.getMyApplications = async (req, res) => {
  try {
    const AM = getAM();
    const apps = await AM.find({ applicantId: req.user._id });
    res.json({ applications: apps });
  } catch (err) { res.status(500).json({ error: 'Could not fetch applications.' }); }
};

exports.getApplicants = async (req, res) => {
  try {
    const JM = getJM(); const AM = getAM();
    const jobs = await JM.find({ postedBy: req.user._id });
    const jobIds = jobs.map(j => j._id);
    const apps = await AM.find({ jobId: { $in: jobIds } });
    res.json({ applications: apps });
  } catch (err) { res.status(500).json({ error: 'Could not fetch applicants.' }); }
};

exports.updateStatus = async (req, res) => {
  try {
    const AM = getAM();
    const app = await AM.findById(req.params.id);
    if (!app) return res.status(404).json({ error: 'Application not found.' });
    if (!['accepted', 'rejected'].includes(req.body.status)) return res.status(400).json({ error: 'Invalid status.' });
    await AM.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.json({ message: `Application ${req.body.status}.` });
  } catch (err) { res.status(500).json({ error: 'Could not update application.' }); }
};

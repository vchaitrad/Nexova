const { validationResult } = require('express-validator');
const Job = require('../models/Job');

exports.getJobs = async (req, res) => {
  try {
    const { search, type, location, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };
    if (type) query.type = type;
    if (location) query.location = new RegExp(location, 'i');

    const skip = (Number(page) - 1) * Number(limit);
    const [jobs, total] = await Promise.all([
      Job.find(query).populate('postedBy', 'name company').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Job.countDocuments(query),
    ]);
    res.json({ success: true, jobs, total });
  } catch { res.status(500).json({ error: 'Failed to fetch jobs.' }); }
};

exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name company email');
    if (!job) return res.status(404).json({ error: 'Job not found.' });
    res.json({ success: true, job });
  } catch { res.status(500).json({ error: 'Failed to fetch job.' }); }
};

exports.createJob = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json({ success: true, message: 'Job posted!', job });
  } catch { res.status(500).json({ error: 'Failed to create job.' }); }
};

exports.applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found.' });
    const alreadyApplied = job.applicants.some(a => a.user.toString() === req.user._id.toString());
    if (alreadyApplied) return res.status(400).json({ error: 'Already applied.' });
    job.applicants.push({ user: req.user._id });
    await job.save();
    res.json({ success: true, message: 'Application submitted!' });
  } catch { res.status(500).json({ error: 'Failed to apply.' }); }
};

exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch { res.status(500).json({ error: 'Failed to fetch your jobs.' }); }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found.' });
    if (job.postedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ error: 'Not authorized.' });
    await job.deleteOne();
    res.json({ success: true, message: 'Job deleted.' });
  } catch { res.status(500).json({ error: 'Failed to delete.' }); }
};
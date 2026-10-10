const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  coverLetter: { type: String, default: '' },
  appliedAt: { type: Date, default: Date.now },
}, { timestamps: true });

applicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);

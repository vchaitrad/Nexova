const mongoose = require('mongoose');

const jobCategories = [
  'Plumbing', 'Electrician', 'Cleaning', 'Painting', 'Carpentry',
  'Construction', 'Driver', 'Cook', 'Gardening', 'AC Service',
  'Pest Control', 'Mechanic', 'Labour', 'Security', 'Delivery',
  'Teaching', 'IT', 'Design', 'Finance', 'Healthcare',
];

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, default: '' },
  location: { type: String, required: true },
  salary: { type: String, default: '' },
  description: { type: String, required: true },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Remote'], default: 'Full-time' },
  category: { type: String, enum: jobCategories, default: 'Labour' },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);

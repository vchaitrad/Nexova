const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: false, minlength: 6, select: false },
  phone:     { type: String, default: '' },
  role:      { type: String, enum: ['jobseeker', 'recruiter', 'admin'], default: 'jobseeker' },
  company:   { type: String },
  bio:       { type: String },
  skills:    [{ type: String }],
  location:  { type: String },
  language:  { type: String, default: 'en' },
  notifyVia: { type: String, enum: ['email', 'whatsapp', 'both'], default: 'email' },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  selfie:    { type: String, default: '' },
  selfieVerified: { type: Boolean, default: false },
  idProof:   { type: String, default: '' },
  verificationStatus: { type: String, enum: ['none', 'pending', 'verified', 'rejected'], default: 'none' },
  adminNotes: { type: String, default: '' },
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

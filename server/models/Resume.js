const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  company: String,
  title: String,
  startDate: String,
  endDate: String,
  bullets: [String]
}, { _id: false });

const EducationSchema = new mongoose.Schema({
  school: String,
  degree: String,
  startYear: String,
  endYear: String
}, { _id: false });

const ResumeSchema = new mongoose.Schema({
  name: String,
  contact: {
    email: String,
    phone: String,
    location: String,
    linkedin: String
  },
  summary: String,
  skills: [String],
  experience: [ExperienceSchema],
  education: [EducationSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', ResumeSchema);

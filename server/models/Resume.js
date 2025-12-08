import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    name: String,
    contact: {
      email: String,
      phone: String,
      location: String,
      linkedin: String,
    },
    summary: String,

    skills: [String],

    experience: [
      {
        title: String,
        company: String,
        startDate: String,
        endDate: String,
        bullets: [String],
      },
    ],

    education: [
      {
        degree: String,
        school: String,
      },
    ],
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", ResumeSchema);

export default Resume;

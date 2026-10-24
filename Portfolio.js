import mongoose from "mongoose";

export const TEMPLATE_IDS = [
  "midnight", "minimal", "gradient", "terminal",
  "cyberpunk", "editorial", "glass", "bento"
];

const projectSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  technologies: { type: String, default: "" },
  link: { type: String, default: "" }
}, { _id: true });

const portfolioSchema = new mongoose.Schema({
  profileId: { type: String },
  title: { type: String, default: "My Portfolio" },
  template: { type: String, enum: TEMPLATE_IDS, default: "midnight" },
  name: { type: String, default: "" },
  role: { type: String, default: "" },
  email: { type: String, default: "" },
  location: { type: String, default: "" },
  objective: { type: String, default: "" },
  education: { type: String, default: "" },
  skills: { type: [String], default: [] },
  projects: { type: [projectSchema], default: [] },
  github: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  photo: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Portfolio", portfolioSchema);

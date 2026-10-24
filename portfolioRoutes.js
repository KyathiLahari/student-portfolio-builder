import express from "express";
import mongoose from "mongoose";
import Portfolio, { TEMPLATE_IDS } from "./Portfolio.js";

const router = express.Router();

const starterPortfolio = {
  title: "My First Portfolio",
  template: "midnight",
  name: "",
  role: "",
  email: "",
  location: "",
  objective: "",
  education: "",
  skills: [],
  projects: [],
  github: "",
  linkedin: "",
  photo: ""
};

const allowedFields = [
  "title", "template", "name", "role", "email", "location", "objective",
  "education", "skills", "projects", "github", "linkedin", "photo"
];

function safeUpdate(body) {
  const update = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) update[field] = body[field];
  }
  return update;
}

function validatePayload(body) {
  if (body.template && !TEMPLATE_IDS.includes(body.template)) return "Invalid portfolio template.";
  if (body.photo && typeof body.photo === "string" && body.photo.length > 6_000_000) {
    return "Photo is too large. Please upload an image smaller than 4 MB.";
  }
  if (body.skills !== undefined && !Array.isArray(body.skills)) return "Skills must be a list.";
  if (body.projects !== undefined && !Array.isArray(body.projects)) return "Projects must be a list.";
  return null;
}

// List every saved portfolio. The old default portfolio is included, not replaced.
router.get("/", async (_req, res) => {
  try {
    const portfolios = await Portfolio.find().sort({ updatedAt: -1 });
    res.json({ portfolios });
  } catch (error) {
    res.status(500).json({ message: "Could not load portfolios.", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const issue = validatePayload(req.body);
    if (issue) return res.status(400).json({ message: issue });
    const portfolio = await Portfolio.create({ ...starterPortfolio, ...safeUpdate(req.body), profileId: undefined });
    res.status(201).json({ message: "Portfolio created.", portfolio });
  } catch (error) {
    res.status(400).json({ message: "Could not create portfolio.", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid portfolio ID." });
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found." });
    res.json({ portfolio });
  } catch (error) {
    res.status(500).json({ message: "Could not load portfolio.", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid portfolio ID." });
    const issue = validatePayload(req.body);
    if (issue) return res.status(400).json({ message: issue });
    const portfolio = await Portfolio.findByIdAndUpdate(req.params.id, { $set: safeUpdate(req.body) }, { new: true, runValidators: true });
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found." });
    res.json({ message: "Portfolio saved successfully.", portfolio });
  } catch (error) {
    res.status(400).json({ message: "Could not save portfolio.", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid portfolio ID." });
    const portfolio = await Portfolio.findByIdAndDelete(req.params.id);
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found." });
    res.json({ message: "Portfolio deleted." });
  } catch (error) {
    res.status(500).json({ message: "Could not delete portfolio.", error: error.message });
  }
});

// Backward-compatible routes for older frontend versions. Existing default data is retained.
router.get("/legacy/default", async (_req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ profileId: "default" });
    if (!portfolio) portfolio = await Portfolio.create({ ...starterPortfolio, profileId: "default" });
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: "Could not load portfolio.", error: error.message });
  }
});

router.put("/legacy/default", async (req, res) => {
  try {
    const issue = validatePayload(req.body);
    if (issue) return res.status(400).json({ message: issue });
    const portfolio = await Portfolio.findOneAndUpdate(
      { profileId: "default" },
      { $set: safeUpdate(req.body), $setOnInsert: { profileId: "default" } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.json({ message: "Portfolio saved successfully.", portfolio });
  } catch (error) {
    res.status(400).json({ message: "Could not save portfolio.", error: error.message });
  }
});

export default router;

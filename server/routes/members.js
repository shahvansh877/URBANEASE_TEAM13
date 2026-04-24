const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const Member = require("../models/Member");

const router = express.Router();
const uploadsDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post("/", upload.single("document"), async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const rollNumber = req.body.rollNumber?.trim();
    const year = req.body.year?.trim();
    const degree = req.body.degree?.trim();
    const aboutProject = req.body.aboutProject?.trim();
    const aim = req.body.aim?.trim();
    const certificate = req.body.certificate?.trim() || "";
    const internship = req.body.internship?.trim() || "";
    const hobbies = String(req.body.hobbies || "")
      .split(",")
      .map((hobby) => hobby.trim())
      .filter(Boolean);

    if (!name || !rollNumber || !year || !degree || !aboutProject || !aim || hobbies.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Name, roll number, year, degree, about project, hobbies and aim are required",
      });
    }

    const member = await Member.create({
      name,
      rollNumber,
      year,
      degree,
      aboutProject,
      hobbies,
      certificate,
      internship,
      aim,
      document: req.file
        ? {
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
          }
        : undefined,
    });

    return res.status(201).json({
      success: true,
      message: "Member added successfully",
      member,
    });
  } catch (error) {
    console.error("Add member error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to add member right now",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error) {
    console.error("Fetch members error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch members right now",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    return res.status(200).json({
      success: true,
      member,
    });
  } catch (error) {
    console.error("Fetch member details error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch member details right now",
    });
  }
});

module.exports = router;

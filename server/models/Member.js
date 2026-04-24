const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rollNumber: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: String,
      required: true,
      trim: true,
    },
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    aboutProject: {
      type: String,
      required: true,
      trim: true,
    },
    hobbies: [
      {
        type: String,
        trim: true,
      },
    ],
    certificate: {
      type: String,
      trim: true,
      default: "",
    },
    internship: {
      type: String,
      trim: true,
      default: "",
    },
    aim: {
      type: String,
      required: true,
      trim: true,
    },
    document: {
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Member", memberSchema);

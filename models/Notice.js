const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Notice title is required"],
      trim: true,
      maxlength: 120,
    },
    message: {
      type: String,
      required: [true, "Notice message is required"],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now, // Auto adds current date
    },
    link: {
      type: String,
      trim: true,
      default: "", // Optional link (e.g. Google Form, event details, etc.)
    },
    important: {
      type: Boolean,
      default: false, // Highlight if true
    },
  },
  {
    timestamps: true, // Adds createdAt & updatedAt fields automatically
  }
);

module.exports = mongoose.model("Notice", noticeSchema);

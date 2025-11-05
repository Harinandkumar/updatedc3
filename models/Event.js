const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      type: String,
      default: "TBA",
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    imagelink: {
      type: String,
      default: "/assets/img/default-event.jpg", // fallback image
      trim: true,
    },
    prize: {
      type: String,
      default: "Exciting Rewards",
      trim: true,
    },
    link: {
      type: String,
      default: "", // Registration link (optional, admin can update later)
      trim: true,
    },
  },
  {
    timestamps: true, // auto adds createdAt & updatedAt
  }
);

module.exports = mongoose.model("Event", eventSchema);

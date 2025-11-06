const mongoose = require("mongoose");

const topWinnerSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  winners: [
    {
      position: { type: String, enum: ["1st", "2nd", "3rd"], required: true },
      name: { type: String, required: true },
      roll: { type: String, required: true },
    },
  ],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TopWinner", topWinnerSchema);

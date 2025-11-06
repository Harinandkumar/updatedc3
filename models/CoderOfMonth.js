const mongoose = require('mongoose');

const coderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roll: { type: String, required: true },
  achievement: { type: String, required: true },
  image: { type: String, required: true },
  month: { type: String, required: true },
});

module.exports = mongoose.model('CoderOfMonth', coderSchema);

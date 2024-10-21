const mongoose = require("mongoose");

const launchSchema = new mongoose.Schema({
  rocket: {
    type: String,
    required: true,
    default: 100,
    min: 100,
    max: 999,
  },
  destination: {
    type: String,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  customers: {
    type: [String],
    required: true,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  flightNumber: {
    type: Number,
    required: true,
    unique: true,
    upcoming: {
      type: Boolean,
      default: true,
    },
    success: {
      type: Boolean,
      default: true,
    },
  },
});

const Launch = mongoose.model("Launch", launchSchema);

module.exports = Launch;

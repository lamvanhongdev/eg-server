const mongoose = require("mongoose");

const SettingSchema = mongoose.Schema(
  {
    learnCountFactor: {
      type: Number,
      default: 1,
    },
    scoreFactor: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("Setting", SettingSchema);

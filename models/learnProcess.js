const mongoose = require("mongoose");

const LearnProcessSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    totalExp: {
      type: Number,
      default: 0,
    },
    weekExp: {
      type: Number,
      default: 0,
    },
    dayExp: {
      type: Number,
      default: 0,
    },
    lastDay: {
      type: String,
      default: "",
    },
    lastWeek: {
      type: String,
      default: "",
    },

    streak: {
      type: Number,
      default: 0,
    },
    streakData: {
      type: String,
      default: "",
    },
  },
  {
    timestampt: true,
  }
);

module.exports = mongoose.model("learnProcess", LearnProcessSchema);

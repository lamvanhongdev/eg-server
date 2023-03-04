const mongoose = require("mongoose");

const LearnWordSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    word: {
      type: mongoose.Types.ObjectId,
      ref: "word",
      required: true,
    },
    learnCount: {
      type: Number,
      default: 0,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    gameScore: {
      type: Number,
      default: 0,
    },
    result: [
      {
        learnType: String,
        score: Number,
        _id: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LearnWord", LearnWordSchema);

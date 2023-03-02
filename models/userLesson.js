const mongoose = require("mongoose");

const userLesson = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "user",
    },
    course: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "course",
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("userlesson", userLesson);

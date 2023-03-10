const mongoose = require("mongoose");

const LessonSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "course",
      required: true,
    },

    index: {
      type: Number,
      required: false,
      unique: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("lesson", LessonSchema);

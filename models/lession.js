const mongoose = require("mongoose");

const LessionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    index: {
      type: Number,
      unique: true,
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("lession", LessionSchema);

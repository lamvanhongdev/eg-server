const mongoose = require("mongoose");

const WordSchema = mongoose.Schema(
  {
    originWord: {
      type: String,
      required: true,
    },
    translatedWord: {
      type: String,
      required: true,
    },
    ipa: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    sound: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: "en-vi",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("word", WordSchema);

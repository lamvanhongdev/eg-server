const word = require("../models/word");

const router = require("express").Router();

router.get("/getAll", async (req, res) => {
  const options = {};

  const cursor = await word.find();
  if (cursor) {
    res.status(200).json({
      success: true,
      data: cursor,
    });
  } else {
    res.status(200).json({
      success: true,
      msg: "No data found",
    });
  }
});

router.get("/learning", async (req, res) => {
  const cursor = await word.find().sort({ datefield: 1 }).limit(5);
  if (cursor) {
    res.status(200).json({
      success: true,
      data: cursor,
    });
  } else {
    res.status(200).json({
      success: true,
      msg: "No data found",
    });
  }
});

router.post("/save", async (req, res) => {
  const newWord = word({
    originWord: req.body.originWord,
    translatedWord: req.body.translatedWord,
    ipa: req.body.ipa,
    imageUrl: req.body.imageUrl,
    sound: req.body.sound,
    type: req.body.type || "en-vi",
  });

  try {
    const savedWord = await newWord.save();
    res.status(200).json({
      success: true,
      msg: "Save sucessfully",
      word: savedWord,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      msg: err,
    });
  }
});

router.delete("/delete/:deleteId", async (req, res) => {
  const filter = { _id: req.params.deleteId };

  const result = await word.deleteOne(filter);
  if (result.deletedCount === 1) {
    res.status(200).send({ success: true, msg: "Data Deleted" });
  } else {
    res.status(200).send({ success: false, msg: "Data Not Found" });
  }
});

module.exports = router;

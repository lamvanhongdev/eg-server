const LearnWord = require("../models/learnWord");

const router = require("express").Router();

router.get("/getall", async (req, res) => {
  const cursor = await LearnWord.find();

  if (cursor) {
    return res.status(200).json({
      success: true,
      data: cursor,
    });
  } else {
    return res.status(200).json({
      success: true,
      msg: "No data found",
    });
  }
});

router.post("/save", async (req, res) => {
  const newData = new LearnWord(req.body);
  try {
    const savedData = await newData.save();
    if (savedData != null) {
      return res.status(200).json({
        success: true,
        msg: "Save successfully",
        data: savedData,
      });
    } else {
      return res.status(400).json({
        success: false,
        msg: "something wrong",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err,
    });
  }
});
module.exports = router;

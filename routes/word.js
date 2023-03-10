const word = require("../models/word");
const LearnWord = require("../models/learnWord");
const learnProcess = require("../models/learnProcess");

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
router.get("/getAllInLesson/:lessonId", async (req, res) => {
  if (req.params.lessonId.length < 10)
    return res.status(400).json({
      success: false,
      msg: "input correct lessonID",
    });
  const options = {
    lesson: req.params.lessonId,
  };

  const cursor = await word.find(options);
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
  //const cursor = await word.find().sort({ datefield: 1 }).limit(4);
  const cursor = await word.aggregate([{ $sample: { size: 4 } }]);

  const randomCursor = await word.aggregate([{ $sample: { size: 6 } }]);
  if (cursor) {
    res.status(200).json({
      success: true,
      randomWord: randomCursor,
      data: cursor,
    });
  } else {
    res.status(200).json({
      success: true,
      msg: "No data found",
    });
  }
});

router.post("/getlearning", async (req, res) => {
  // req include: userid,maxWord
  try {
    if (req.body.userId == null)
      return res.status(401).json({
        success: false,
        msg: "missing userID",
      });
    if (!req.body.maxWord) {
      req.body.maxWord = 6;
    }
    // get current courseId from user
    const learnProcessData = await learnProcess.findOne({
      user: req.body.userId,
    });
    if (!learnProcessData) {
      return res.status(200).json({
        success: false,
        msg: "User have not choose course!",
      });
    }

    const randomCursor = await word.aggregate([{ $sample: { size: 6 } }]);
    const allcursorWord = await word.find().populate({
      path: "lesson",
      match: { course: learnProcessData.course },
    });

    const allWord = [];
    for (var i = 0; i < allcursorWord.length; i++) {
      if (allcursorWord[i].lesson != null) {
        const temptData = {
          ...allcursorWord[i]._doc,
          lesson: allcursorWord[i].lesson._id,
        };
        allWord.push(temptData);
      }
    }

    const learnWords = [];
    for (var i = 0; i < allWord.length; i++) {
      if (learnWords.length >= req.body.maxWord) break;
      const currWord = await LearnWord.findOne({
        word: allWord[i]._id,
        user: req.body.userId,
      });
      if (!currWord) {
        learnWords.push({
          word: allWord[i],
          learnWord: currWord,
        });
      }
    }
    return res.status(200).json({
      success: true,
      data: learnWords,
      randomWord: randomCursor,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err,
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
    lesson: req.body.lessonId,
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

router.put("/updateAllWord", async (req, res) => {
  try {
    const cursor = await word.find();
    for (let i = 0; i < 10; i++) {
      const newData = { ...cursor[i]._doc, lesson: req.body.lessonId };
      const savedNewData = await word.findByIdAndUpdate(cursor[i]._id, newData);
    }
    return res.status(200).json({
      success: true,
      msg: "update successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "server has problem",
      error,
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

const learnWord = require("../models/learnWord");
const lesson = require("../models/lesson");
const word = require("../models/word");
const router = require("express").Router();

router.get("/getall", async (req, res) => {
  try {
    const cursor = await lesson.find();
    return res.status(200).json({
      success: true,
      data: cursor,
    });
  } catch (error) {}
});
router.get("/getlesson/:id", async (req, res) => {
  try {
    const cursor = await lesson.find({
      course: req.params.id,
    });
    return res.status(200).json({
      success: true,
      data: cursor,
    });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

router.post("/save", async (req, res) => {
  try {
    const newLesson = lesson({
      name: req.body.name,
      course: req.body.courseId,
      index: req.body.index,
    });
    const savedLesson = await newLesson.save();
    if (savedLesson) {
      return res.status(200).json({
        success: true,
        msg: "save successfully!",
        savedLesson,
      });
    } else {
      return res.status(200).json({
        success: false,
        msg: "cant save",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: error,
    });
  }
});

router.post("/getCourseLesson", async (req, res) => {
  try {
    const cursor = await lesson.find({
      course: req.body.courseId,
    });
    const result = [];

    for (let i = 0; i < cursor.length; i++) {
      const wordInLesson = await word.find({
        lesson: cursor[i]._id,
      });
      if (wordInLesson) console.log(wordInLesson.length);

      let count = 0; // count word learn by userId and word in lesson
      for (let i = 0; i < wordInLesson.length; i++) {
        const currLearnWord = await learnWord.findOne({
          word: wordInLesson[i]._id,
          user: req.body.userId,
        });
        if (currLearnWord) count++;
      }
      console.log(count);
      result.push({
        ...cursor[i]._doc,
        totalWord: wordInLesson.length,
        learnedWord: count,
      });
    }
    return res.status(200).json({
      success: true,
      data: result,
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
  try {
    const result = await lesson.findByIdAndDelete(req.params.deleteId);
    if (result) {
      return res.status(200).json({
        success: true,
        msg: "deleted",
      });
    } else
      return res.status(200).json({
        success: false,
        msg: "no found",
      });
  } catch (error) {}
});

module.exports = router;

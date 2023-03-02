const lesson = require("../models/lesson");
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
    return res.status(500).json({
      success: false,
      msg: error,
    });
  }
});

router.post("/getCourseLesson/:courseId", async (req, res) => {
  try {
    const result = await lesson.find({
      course: req.params.courseId,
    });
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

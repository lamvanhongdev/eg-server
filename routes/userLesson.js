const userlesson = require("../models/userLesson");
const router = require("express").Router();

router.get("/getall", async (req, res) => {
  try {
    const cursor = await userlesson.find();
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

router.post("/fetch", async (req, res) => {
  try {
    const filter = {
      user: req.body.userId,
      course: req.body.courseId,
    };

    const cursor = await userlesson.findOne(filter);
    if (cursor) {
      return res.status(200).json({
        success: true,
        data: cursor,
      });
    } else {
      const newUserLesson = userlesson({
        user: req.body.userId,
        course: req.body.courseId,
      });
      const savedData = await newUserLesson.save();
      if (savedData) {
        return res.status(200).json({
          success: true,
          msg: "Save new data",
          data: savedData,
        });
      } else {
        return res.status(200).json({
          success: false,
          msg: "something wrong",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

module.exports = router;

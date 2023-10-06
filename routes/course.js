const course = require("../models/course");
const router = require("express").Router();

router.get("/getall", async (req, res) => {
  try {
    const cursor = await course.find();
    return res.status(200).json({
      success: true,
      data: cursor,
    });
  } catch (err) {
    return res.status(500).json({ err });
  }
});
router.post("/getActiveCourse", async (req, res) => {
  try {
    const filter = {
      status: true,
    };

    const cursor = await course.find(filter);
    return res.status(200).json({
      success: true,
      data: cursor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "server has problem",
      error,
    });
  }
});
router.put("/update/:id", async (req, res) => {
  try {
    const updatedCourse = await course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        upsert: true,
      }
    );
    if (updatedCourse) {
      return res.status(200).json({
        success: true,
        updatedCourse,
      });
    } else {
      return res.status(200).json({
        success: false,
        msg: "cant update",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
    });
  }
});
router.post("/save", async (req, res) => {
  try {
    const newCourse = course({
      name: req.body.name,
      status: req.body.status,
    });

    const savedCourse = await newCourse.save();
    if (savedCourse) {
      return res.status(200).json({
        success: true,
        msg: "Save data successfully!",
        data: savedCourse,
      });
    }
  } catch (err) {}
});

router.delete("/delete/:deleteId", async (req, res) => {
  try {
    const result = await course.findByIdAndDelete(req.params.deleteId);

    if (result) {
      return res.status(200).json({
        success: true,
        msg: "delete successfully",
      });
    }
  } catch (error) {}
});

module.exports = router;

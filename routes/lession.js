const lession = require("../models/lession");
const router = require("express").Router();

router.get("/getall", async (req, res) => {
  try {
    const cursor = await lession.find();
    return res.status(200).json({
      success: true,
      data: cursor,
    });
  } catch (error) {}
});

router.post("/save", async (req, res) => {
  try {
    const newLession = lession({
      name: req.body.name,
      course: req.body.courseId,
    });
  } catch (error) {}
});

router.delete("/delete/:deleteId", async (req, res) => {
  try {
    const result = await lession.findByIdAndDelete(req.params.deleteId);
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

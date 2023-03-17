const learnProcess = require("../models/learnProcess");
const user = require("../models/user");
const {
  lastDay,
  lastWeek,
  GetLastDay,
  getPreviousDay,
} = require("../utils/utility");

const router = require("express").Router();

router.post("/getLeaderBoard/:typeLeader", async (req, res) => {
  try {
    var cursor = {};
    if (req.params.typeLeader == "day") {
      const filter = { lastDay };
      cursor = await learnProcess.find(filter).sort({ dayExp: -1 }).limit(20);
    }
    if (req.params.typeLeader == "week") {
      const filter = { lastWeek };
      cursor = await learnProcess.find(filter).sort({ weekExp: -1 }).limit(20);
    }
    if (req.params.typeLeader == "total") {
      const filter = {};
      cursor = await learnProcess.find(filter).sort({ totalExp: -1 }).limit(20);
    }

    const resultData = [];
    var hasUser = false;
    for (var i = 0; i < cursor.length; i++) {
      const currUser = await user.findOne({ _id: cursor[i].user });
      if (currUser._id == req.body.userId) hasUser = true;
      const currData = {
        ...cursor[i]._doc,
        imageUrl: currUser.imageURL,
        name: currUser.name,
      };

      resultData.push(currData);
    }
    if (!hasUser) {
      const fetchUser = await user.findById(req.body.userId);
      const fetchUserLearn = await learnProcess.findOne({
        user: req.body.userId,
      });
      const userData = {
        imageUrl: fetchUser.imageURL,
        name: fetchUser.name,
        ...fetchUserLearn._doc,
      };
      resultData.push(userData);
    }

    return res.status(200).json({
      success: true,
      data: resultData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      msg: "server has problem",
      err,
    });
  }
});

router.post("/updateExp", async (req, res) => {
  try {
    if (req.body.exp == null) {
      return res.status(200).json({
        success: false,
        msg: "exp is required",
      });
    }

    // if has data
    const option = {
      user: req.body.userId,
    };

    var cursor = await learnProcess.findOne(option);

    if (!cursor) {
      const newLearnProcess = learnProcess({
        user: req.body.userId,
      });
      cursor = await newLearnProcess.save();
    }
    //console.log("Hong", cursor);
    // handle

    const newData = { ...cursor._doc };
    //console.log("new Data: ", newData);
    newData.totalExp += req.body.exp;

    if (newData.lastDay == lastDay) {
      newData.dayExp += req.body.exp;
    } else {
      newData.lastDay = lastDay;
      newData.dayExp = req.body.exp;
    }

    if (newData.lastWeek == lastWeek) {
      newData.weekExp += req.body.exp;
    } else {
      newData.lastWeek = lastWeek;
      newData.weekExp = req.body.exp;
    }

    // check streak and update
    if (req.body.exp > 0) {
      const decodeData = newData.streakData.split(" ");

      if (newData.streakData.length > 0) {
        if (decodeData[decodeData.length - 1] != lastDay) {
          if (decodeData.length > 1) {
            if (
              GetLastDay(getPreviousDay(1)) == decodeData[decodeData.length - 1]
            ) {
              newData.streak = newData.streak + 1;
              newData.streakData = newData.streakData + " " + lastDay;
            } else {
              newData.streak = 1;
              newData.streakData = newData.streakData + " " + lastDay;
            }
          }
        }
      } else {
        //default for first time
        newData.streakData = newData.streakData + " " + lastDay;
        newData.streak = 1;
      }
    }

    const result = await learnProcess.findOneAndUpdate(
      {
        user: req.body.userId,
      },
      newData
    );
    if (result) {
      return res.status(200).json({
        success: true,
        msg:
          req.body.exp != 0
            ? "update exp successfully !"
            : "get data successfully",
        data: newData,
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
router.post("/getInfo", async (req, res) => {
  try {
    const option = {
      user: req.body.userId,
    };
    const cursor = await learnProcess.findOne(option);

    if (cursor) {
      return res.status(200).json({
        success: true,
        data: cursor,
      });
    } else {
      const newLearnProcess = learnProcess({
        user: req.body.userId,
      });
      const savedData = await newLearnProcess.save();
      res.status(200).json({
        success: true,
        data: savedData,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err,
    });
  }
});

router.get("/getall", async (req, res) => {
  try {
    const cursor = await learnProcess.find();

    if (cursor) {
      return res.status(200).json({
        success: true,
        data: cursor,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "server has problem",
      err,
    });
  }
});

router.put("/updateAll", async (req, res) => {
  try {
    const cursor = await learnProcess.find();
    for (let i = 0; i < cursor.length; i++) {
      const newData = { ...cursor[i]._doc, course: req.body.courseId };
      await learnProcess.findByIdAndUpdate(cursor[i]._id, newData);
    }
    return res.status(200).json({
      success: true,
      msg: "update data successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      msg: "server has problem",
      error,
    });
  }
});

router.post("/updateCourse", async (req, res) => {
  try {
    const updatedData = await learnProcess.findByIdAndUpdate(req.body.userId, {
      $set: {
        course: req.body.courseId,
      },
    });
    if (updatedData) {
      return res.status(200).json(updatedData);
    } else
      return res.status(200).json({
        success: false,
      });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.delete("/delete/:deleteId", async (req, res) => {
  try {
    const result = await learnProcess.deleteOne({
      _id: req.params.deleteId,
    });
    if (result.deletedCount == 1) {
      return res.status(200).json({
        success: true,
        msg: "Data deleted",
      });
    } else
      return res.status(200).json({
        success: false,
        msg: "Data not found",
      });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "server has problem",
      err,
    });
  }
});

module.exports = router;

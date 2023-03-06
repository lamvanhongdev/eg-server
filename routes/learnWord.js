const learnProcess = require("../models/learnProcess");
const LearnWord = require("../models/learnWord");
const word = require("../models/word");

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

router.get("/getword", async (req, res) => {
  try {
    const cursor = await LearnWord.findOne({
      word: req.body.word,
      user: req.body.user,
    });

    if (cursor) {
      return res.status(200).json({
        succcess: true,
        data: cursor,
      });
    } else {
      return res.status(200).json({
        success: false,
        msg: "Not Found",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err,
    });
  }
});

router.post("/numOfLearnWord", async (req, res) => {
  try {
    const cursor = await LearnWord.find({
      user: req.body.userId,
    });
    const allword = await word.find();
    if (cursor) {
      return res.status(200).json({
        success: true,
        numLearned: cursor.length,
        totalWord: allword.length,
      });
    } else
      return res.status(200).json({
        success: false,
        numLearned: 0,
      });
  } catch (err) {
    return res.status(500).json({
      msg: err,
    });
  }
});

router.post("/getpractice", async (req, res) => {
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
    // const allLearnWord = await LearnWord.find({
    //   user: req.body.userId,
    // }).sort({
    //   totalScore: 1,
    // });

    const allLearnWordCursor = await LearnWord.find({
      user: req.body.userId,
    })
      .populate({
        path: "word",
        populate: {
          path: "lesson",
          match: { course: learnProcessData.course },
        },
      })
      .sort({
        totalScore: 1,
      });

    const allLearnWord = [];
    for (var i = 0; i < allLearnWordCursor.length; i++) {
      if (allLearnWordCursor[i].word.lesson != null) {
        const temptData = {
          ...allLearnWordCursor[i]._doc,
          word: allLearnWordCursor[i].word._id,
        };
        allLearnWord.push(temptData);
      }
    }

    const learnWords = [];
    for (var i = 0; i < 6; i++) {
      const currWord = await word.findOne({
        _id: allLearnWord[i].word,
      });
      learnWords.push({
        word: currWord,
        learnWord: allLearnWord[i],
      });
    }
    return res.status(200).json({
      success: true,
      data: learnWords,
      randomWord: randomCursor,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      msg: err,
    });
  }
});

router.delete("/deleteAll", async (req, res) => {
  try {
    const result = await LearnWord.deleteMany();
    res.status(200).json({
      success: true,
      msg: "Delete all successfully",
      result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err,
    });
  }
});
router.post("/updateGameScore", async (req, res) => {
  try {
    const updatedData = await LearnWord.findByIdAndUpdate(
      req.body.id,
      {
        gameScore: req.body.gameScore,
        totalScore: req.body.totalScore,
      },
      { upsert: true, new: true }
    );
    if (updatedData) {
      return res.status(200).json({
        success: true,
        msg: "update gameScore successfully",
        updatedData,
      });
    } else {
      return res.status(400).json({
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error,
    });
  }
});

router.post("/save", async (req, res) => {
  const newData = new LearnWord(req.body);
  const filter = {
    user: req.body.user,
    word: req.body.word,
  };
  try {
    const existWord = await LearnWord.findOne(filter);
    if (existWord) {
      const updateWord = await LearnWord.findOneAndUpdate(filter, req.body);
      if (updateWord) {
        return res.status(200).json({
          success: true,
          msg: "Update SuccessFully",
          data: updateWord,
        });
      } else {
        return res.status(200).json({
          success: false,
          msg: "Something wrong",
        });
      }
    } else {
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
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err,
    });
  }
});
module.exports = router;

const express = require("express");
const app = express();
require("dotenv/config");
const cors = require("cors");
const { default: mongoose } = require("mongoose");

app.use(cors({ origin: true }));
app.use(express.json());

// user authentication routes
const userRoute = require("./routes/auth");
app.use("/api/users/", userRoute);

// Artist links
const artistsRoute = require("./routes/artists");
app.use("/api/artists/", artistsRoute);

// Album links
const albumRoute = require("./routes/albums");
app.use("/api/albums/", albumRoute);

// Songs links
const songRoute = require("./routes/songs");
app.use("/api/songs/", songRoute);

// word link
const wordRoute = require("./routes/word");
app.use("/api/words/", wordRoute);

// learn word link
const learnWordRoute = require("./routes/learnWord");
app.use("/api/learnwords/", learnWordRoute);

// learnProcess link
const learnProcess = require("./routes/learnProcess");
app.use("/api/learnProcess/", learnProcess);

// course
const courseRoute = require("./routes/course");
app.use("/api/course/", courseRoute);

// lesson
const lessonRoute = require("./routes/lesson");
app.use("/api/lesson/", lessonRoute);

// user lesson
const userlesson = require("./routes/userLesson");
app.use("/api/userlesson", userlesson);

// If any depreciation warning add depreciation options
// mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true }, () => {
//   console.log("Mongodb Connected");
// });

mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.hhebfwz.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);
mongoose.connection
  .once("open", () => console.log("Connected"))
  .on("error", (error) => {
    console.log(`Error : ${error}`);
  });

app.listen(4000, () => console.log("lisitening to port 4000"));

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/video-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Video schema and model (collection will be 'videos' in MongoDB)
const videoSchema = new mongoose.Schema({
  name: String,
  url: String,
});
const Video = mongoose.model("Video", videoSchema); // Collection: 'Videos'

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// // API route to upload a video
// app.post("/upload", upload.single("video"), async (req, res) => {
//   const video = new Video({
//     name: req.file.originalname,
//     url: `http://localhost:5000/uploads/${req.file.filename}`,
//   });
//   await video.save();
//   res.json(video);
// });

app.post("/upload", upload.single("video"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
  
      const video = new Video({
        name: req.file.originalname,
        url: `http://localhost:5000/uploads/${req.file.filename}`,
      });
  
      await video.save();
  
      res.status(200).json(video);
    } catch (error) {
      console.error("Error uploading video:", error);
      res.status(500).json({ message: "Server error while uploading video" });
    }
  });
  

// API route to fetch all videos
app.get("/videos", async (req, res) => {
  const videos = await Video.find();
  res.json(videos);
});

// Start the server
app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});

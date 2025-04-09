const multer = require("multer");
const GridFsStorage  = require("multer-gridfs-storage");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

let storage;
let upload;

const initStorage = () => {
  if (!storage) {
    storage = new GridFsStorage({
      url: process.env.MONGO_URI,
      file: (req, file) => ({
        filename: `${Date.now()}-${file.originalname}`,
        bucketName: "logos",
      }),
    });

    upload = multer({
      storage,
      limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
      fileFilter: (req, file, cb) => {
        const isImage = file.mimetype.startsWith("image/");
        cb(null, isImage);
      },
    });

    console.log("✅ GridFS storage initialized.");
  }
};

// Initialize GridFS after DB connects
mongoose.connection.once("open", () => {
  console.log("MongoDB connection open - initializing GridFS storage");
  initStorage();
});

module.exports = (req, res, next) => {
  if (!upload) {
    return res.status(503).json({ error: "Storage not initialized yet. Please try again shortly." });
  }
  
  return upload.single("logo")(req, res, next);
};

import multer from "multer";
import path from "path";

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the folder for storing uploaded files
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using timestamp and original file extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Configure multer with the defined storage
const upload = multer({ storage });

export { upload };

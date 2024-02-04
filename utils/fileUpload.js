const multer = require("multer");
const path = require("path");

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the directory where you want to store uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Set up multer instance with the storage configuration
const upload = multer({ storage: storage });

// Utility function to handle file uploads
function handleFileUpload(fieldName) {
  return upload.single(fieldName);
}

// how to use
// npm install multer

module.exports = {
  handleFileUpload,
};

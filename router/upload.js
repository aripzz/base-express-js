const express = require("express");
const router = express.Router();
const { handleFileUpload } = require("./utils");

router.use("/uploads", express.static("uploads")); // Serve uploaded files statically

router.post("/upload", handleFileUpload("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Access the uploaded file details using req.file
  const { filename, path, size } = req.file;

  res.json({ filename, path, size });
});

// API for uploading product with image
router.post("/upload-product", handleFileUpload("image"), (req, res) => {
  const { name, productId, stock, description } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  // Access the uploaded image details using req.file
  const { filename, path, size } = req.file;

  res.json({
    productName: name,
    productId,
    stock,
    description,
    image: { filename, path, size },
  });
});

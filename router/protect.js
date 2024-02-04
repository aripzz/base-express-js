require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // tambahkan import jwt
const { extractToken } = require("../middleware");
const { Validator } = require("node-input-validator");

const secretKey = process.env.secretKeyJwt; // Gantilah dengan kunci rahasia yang lebih kuat di lingkungan produksi.

// Endpoint untuk sign in dan mendapatkan token
router.post("/signin", (req, res) => {
  // Proses otentikasi user (gantilah dengan metode otentikasi yang sesuai)
  const user = {
    id: 1,
    username: "exampleUser",
    email: "user@example.com",
  };

  // Generate token dan refresh token
  const accessToken = jwt.sign(user, secretKey, { expiresIn: "1d" }); // Access token berlaku selama 1 menit
  const refreshToken = jwt.sign(user, secretKey + "_refresh", {
    expiresIn: "7d",
  }); // Refresh token berlaku selama 7 hari

  res.json({ accessToken, refreshToken });

  //prefer if you want secure system
  // res
  //   .cookie("refreshToken", refreshToken, {
  //     httpOnly: true,
  //     sameSite: "strict",
  //   })
  //   .header("Authorization", accessToken)
  //   .send(user);
});

// Contoh protected route yang memerlukan access token
router.get("/protected", extractToken, async (req, res) => {
  const accessToken = req.token;

  // Verifikasi access token
  jwt.verify(accessToken, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid access token" });
    }

    // Jika verifikasi berhasil, berikan akses ke resource yang dilindungi
    res.json({ message: "Protected resource accessed", user });
  });
});

// Endpoint untuk refresh token
router.post("/refresh", extractToken, (req, res) => {
  Validator;
  const refreshToken = req.token;

  // Verifikasi refresh token
  jwt.verify(refreshToken, secretKey + "_refresh", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Jika verifikasi berhasil, buat dan kirimkan access token baru
    const newAccessToken = jwt.sign(user, secretKey);
    res.json({ accessToken: newAccessToken });
  });
});

module.exports = router; // tambahkan ekspor router

// Middleware untuk mengekstrak token dari header Authorization
const extractToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }
  req.token = token;
  next();
};

module.exports = { extractToken };

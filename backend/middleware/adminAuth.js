const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(403).json({ success: false, message: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    if (decoded.isAdmin) {
      next();
    } else {
      res.status(403).json({ success: false, message: "Not an admin" });
    }
  } catch (error) {
    res.status(403).json({ success: false, message: "Invalid token" });
  }
};

module.exports = adminAuth;


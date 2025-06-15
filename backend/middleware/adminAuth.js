// middleware/adminAuth.js
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === process.env.ADMIN_API_KEY) {
    next();
  } else {
    res.status(403).json({ success: false, message: "Unauthorized Admin Access" });
  }
};

module.exports = adminAuth;

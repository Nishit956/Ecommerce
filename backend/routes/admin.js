const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SECRET_KEY = process.env.ADMIN_JWT_SECRET; // Keep this secret and strong

router.post("/admin-login", (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ isAdmin: true }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: "Invalid admin credentials" });
  }
});

module.exports = router;

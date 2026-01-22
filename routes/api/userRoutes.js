const router = require("express").Router();
const { User } = require("../../models");
const { signToken } = require("../../utils/auth");

// POST /api/users/register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body || {};

    // Basic validation (prevents empty-body 400 confusion)
    // Could be improved with more detailed checks
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "username, email, and password are required",
      });
    }

    const user = await User.create({ username, email, password });

    // Don't send password back
    const userSafe = user.toObject();
    delete userSafe.password;

    const token = signToken(userSafe);

    return res.status(201).json({ token, user: userSafe });
  } catch (err) {
    // Duplicate key (username/email already exists)
    if (err?.code === 11000) {
      const field = Object.keys(err.keyPattern || err.keyValue || {})[0] || "field";
      return res.status(400).json({
        message: `${field} already exists. Please use a different ${field}.`,
      });
    }

    // Mongoose validation errors (nice readable message)
    if (err?.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(" | ") });
    }

    console.error("REGISTER ERROR:", err);
    return res.status(400).json({ message: "Registration failed." });
  }
});

// POST /api/users/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Can't find this user" });
    }

    const correctPw = await user.isCorrectPassword(password);

    if (!correctPw) {
      return res.status(400).json({ message: "Wrong password!" });
    }

    // Don't send password back
    const userSafe = user.toObject();
    delete userSafe.password;

    const token = signToken(userSafe);

    return res.json({ token, user: userSafe });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Login failed." });
  }
});

module.exports = router;

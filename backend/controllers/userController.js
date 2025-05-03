// controllers/userController.js
const User = require("../models/UserModel"); // Make sure this path is correct

exports.registerUser = async (req, res) => {
  try {
    const { name, rollNo, email, password } = req.body;

    if (!name || !rollNo || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new User({ name, rollNo, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

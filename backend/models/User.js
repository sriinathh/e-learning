const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  rollNumber: String,
  className: String,
  lastActive: Date,
  status: {
    type: String,
    enum: ["online", "offline"],
    default: "offline"
  }
});

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  limit: {
    type: Number,
    default: 5,
  },
  credits: {
    type: Number,
    default: 500,
  },
  insurances: {
    type: Array,
    default: [],
  },
  profilePhoto: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);

const express = require("express");
const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const apiKeyMiddleware = require("../middlewares/apiKeyMiddleware");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/register",
  apiKeyMiddleware,
  upload.single("profilePhoto"),
  async (req, res) => {
    const { fullName, username, password } = req.body;

    if (!fullName || !username || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken." });
      }

      let profilePhotoUrl = "";

      if (req.file) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "profile_photos" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        });
        profilePhotoUrl = result.secure_url;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        fullName,
        username,
        password: hashedPassword,
        userId: uuidv4(),
        profilePhoto: profilePhotoUrl,
      });

      await user.save();
      res.status(201).json({
        message: "User registered successfully.",
        userId: user.userId,
      });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Server error." });
    }
  }
);

router.post("/login", apiKeyMiddleware, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET);

    return res.status(200).json({
      message: "Login successful.",
      token,
      userId: user.userId,
      fullName: user.fullName,
      credits: user.credits,
      insurances: user.insurances,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Server error." });
  }
});

router.get("/get-user", apiKeyMiddleware, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      token,
      userId: user.userId,
      fullName: user.fullName,
      credits: user.credits,
      insurances: user.insurances,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/add-insurance", apiKeyMiddleware, async (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res
      .status(400)
      .json({ message: "Insurance name and price are required." });
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.credits < price) {
      return res.status(400).json({ message: "Insufficient credits." });
    }

    const newInsurance = { name, price };
    user.credits -= price;
    user.insurances.push(newInsurance);
    await user.save();

    res.status(200).json({
      token,
      userId: user.userId,
      fullName: user.fullName,
      credits: user.credits,
      insurances: user.insurances,
    });
  } catch (error) {
    console.error("Error adding insurance:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

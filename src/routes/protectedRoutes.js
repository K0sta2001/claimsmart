const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const { OpenAI } = require("openai");
const fs = require("fs").promises;
const path = require("path");
const User = require("../models/user");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const upload = multer();
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const openai = new OpenAI({
  organization: process.env.ORGANIZATION_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

router.get("/check-token", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Token is valid." });
});

router.post(
  "/chat",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    const { message, userId } = req.body;
    const file = req.file;

    try {
      const user = await User.findOne({ userId });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const profilePhotoUrl = user.profilePhoto;
      if (!profilePhotoUrl) {
        return res.status(400).json({ error: "User profile photo is missing" });
      }

      const systemInstructions = await fs.readFile(
        path.join(__dirname, "../../data.txt"),
        "utf-8"
      );

      const systemMessage = {
        role: "system",
        content: `Here is the user's profile photo: ${profilePhotoUrl}. ${systemInstructions}`,
      };

      let uploadedFileUrl = "";
      if (file && file.size > 0) {
        const uploadedFile = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "chat_files" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });

        uploadedFileUrl = uploadedFile.secure_url;
      }

      const userMessage = {
        role: "user",
        content: [
          { type: "text", text: message },
          uploadedFileUrl && {
            type: "image_url",
            image_url: { url: uploadedFileUrl },
          },
        ].filter(Boolean),
      };

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [systemMessage, userMessage],
      });

      const assistantMessage =
        response.choices[0]?.message?.content || "No response from assistant";

      if (assistantMessage.includes("will be compensated")) {
        user.credits += 50;
        await user.save();
      }

      res.status(200).json({ assistantMessage, user, token: user.token });
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ error: "Failed to process the message." });
    }
  }
);

module.exports = router;

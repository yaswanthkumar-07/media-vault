const express = require("express");
const router = express.Router();

const Media = require("../models/Media");

// GET all media
router.get("/", async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new media
router.post("/", async (req, res) => {
  try {
    const newMedia = new Media(req.body);
    const savedMedia = await newMedia.save();

    res.status(201).json(savedMedia);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE media
router.delete("/:id", async (req, res) => {
  try {
    await Media.findByIdAndDelete(req.params.id);

    res.json({ message: "Media deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// UPDATE media
router.put("/:id", async (req, res) => {
  try {
    const updatedMedia = await Media.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedMedia);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
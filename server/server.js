const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const mediaRoutes = require("./routes/mediaRoutes");

const app = express();

app.use(
  cors({
    origin: [
      "https://themediavault.web.app",
      "https://mediavault-7.web.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

app.use("/media", mediaRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected 🚀"))
.catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("MediaVault Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
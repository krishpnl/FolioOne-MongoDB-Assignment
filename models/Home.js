const mongoose = require("mongoose");
const homeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    greeting: { type: String, default: "Hello, I'm" },
    title: { type: String, required: true, trim: true },
    titlePrefix: { type: String, default: "Creative", trim: true },
    description: { type: String, default: "" },
    profileImage: { type: String, default: "" },
    resumeLink: { type: String, default: "" },
    card1Icon: { type: String, default: "bi bi-palette" },
    card1Title: { type: String, default: "Design" },
    card2Icon: { type: String, default: "bi bi-code-slash" },
    card2Title: { type: String, default: "Code" },
    card3Icon: { type: String, default: "bi bi-lightbulb" },
    card3Title: { type: String, default: "Ideas" },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Home", homeSchema);

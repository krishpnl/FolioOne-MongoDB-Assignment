const mongoose = require("mongoose");
const aboutSchema = new mongoose.Schema(
  {
    sectionTitle: {
      type: String,
      default: "About",
      trim: true,
    },
    sectionDescription: {
      type: String,
      default: "",
      trim: true,
    },
    eyebrow: {
      type: String,
      default: "Hello there",
      trim: true,
    },
    headline: {
      type: String,
      default: "",
      trim: true,
    },
    lead: {
      type: String,
      default: "",
    },
    body: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },
    resumeLink: {
      type: String,
      default: "resume.html",
    },
    location: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    quote: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("About", aboutSchema);

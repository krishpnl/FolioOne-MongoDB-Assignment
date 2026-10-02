const mongoose = require("mongoose");
const educationSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      required: true,
    },
    institution: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "",
    },
    startYear: {
      type: String,
      default: "",
    },
    endYear: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Education", educationSchema);

const mongoose = require("mongoose");
const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "Other",
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Skill", skillSchema);

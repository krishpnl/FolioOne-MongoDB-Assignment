const mongoose = require("mongoose");
const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: "bi bi-code-slash",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Service", serviceSchema);

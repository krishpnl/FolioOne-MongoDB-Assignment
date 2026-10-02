const mongoose = require("mongoose");
const statSchema = new mongoose.Schema(
  {
    value: { type: Number, min: 0, default: 0 },
    suffix: { type: String, default: "+" },
    label: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Stat", statSchema);

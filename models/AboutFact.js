const mongoose = require("mongoose");
const aboutFactSchema = new mongoose.Schema(
  {
    icon: { type: String, default: "bi bi-lightbulb" },
    text: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
module.exports = mongoose.model("AboutFact", aboutFactSchema);

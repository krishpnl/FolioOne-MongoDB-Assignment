const mongoose = require("mongoose");
const aboutJourneySchema = new mongoose.Schema(
  {
    year: { type: String, default: "" },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
module.exports = mongoose.model("AboutJourney", aboutJourneySchema);

const mongoose = require("mongoose");
const aboutSkillCardSchema = new mongoose.Schema(
  {
    icon: { type: String, default: "bi bi-code-slash" },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
module.exports = mongoose.model("AboutSkillCard", aboutSkillCardSchema);

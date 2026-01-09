const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    subject: {
      type: String
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    uploaderRole: {
      type: String,
      enum: ["teacher"],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Materials", materialSchema);
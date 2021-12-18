const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Image || mongoose.model("Image", ImageSchema);

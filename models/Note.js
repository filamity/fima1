const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    unique: true,
    maxlength: [50, "Title must be less than 50 characters"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    maxlength: [500, "Description must be less than 500 characters"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.models.Note || mongoose.model("Note", NoteSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  dueAt: {
    type: Date,
    required: [true, "Due date is required"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.models.Task || mongoose.model("Task", TaskSchema);

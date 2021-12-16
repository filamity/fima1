const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClassTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
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
  completeStatus: [
    {
      student: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      completed: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

module.exports =
  mongoose.models.ClassTask || mongoose.model("ClassTask", ClassTaskSchema);

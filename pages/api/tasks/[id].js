import dbConnect from "../../../utils/dbConnect";
import Task from "../../../models/Task";
import User from "../../../models/User";
import ClassTask from "../../../models/ClassTask";

dbConnect();

export default async function (req, res) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    // Student GET /api/task/:taskId
    // Fetches tasks with matching ID from global tasks bucket
    case "GET":
      try {
        const tasks = await Task.find({ user: id });
        res.status(200).json({ success: true, data: tasks });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    // Student POST /api/task/:taskId
    // Creates a new personal task for the student
    // Then adds the task to the student's task bucket
    case "POST":
      try {
        const task = await Task.create({ ...req.body, user: id });
        await User.findByIdAndUpdate(
          id,
          { $push: { tasks: task._id } },
          { new: true }
        );
        res.status(201).json({ success: true, data: task });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    // Student PUT /api/task/:taskId
    // Only updates task completion
    // Takes in student ID so completion status in classTasks can be updated
    case "PUT":
      try {
        const { student, completed } = req.body;
        const task = await Task.findByIdAndUpdate(
          id,
          { completed: completed },
          { new: true, runValidators: true }
        );
        if (!task) {
          return res
            .status(400)
            .json({ success: false, message: "No task found" });
        }
        ClassTask.findOne({ _id: task.classTask }).then((classTask) => {
          if (!classTask) return;
          let item = classTask.completeStatus.find(
            (obj) => obj.student.toString() === student
          );
          item.completed = completed;
          classTask.save();
        });
        res.status(200).json({ success: true, data: task });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    // Student DELETE /api/task/:taskId
    // Only deletes personal tasks
    // Then removes task from students' task list
    case "DELETE":
      try {
        const task = await Task.findByIdAndDelete(id);
        if (!task) {
          return res
            .status(400)
            .json({ success: false, message: "No task found" });
        }
        await User.findByIdAndUpdate(
          task.user,
          { $pull: { tasks: task._id } },
          { new: true }
        );
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, message: "Bad Request" });
      break;
  }
}

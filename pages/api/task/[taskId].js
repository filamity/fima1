import dbConnect from "../../../utils/dbConnect";
import Task from "../../../models/Task";
import ClassTask from "../../../models/ClassTask";

dbConnect();

export default async function (req, res) {
  const {
    query: { taskId },
    method,
  } = req;

  switch (method) {
    // Student GET /api/task/:taskId
    case "GET":
      try {
        const task = await Task.findById(taskId);
        if (!task) {
          return res.status(404).json({
            success: false,
            message: "Task not found",
          });
        }
        res.status(200).json({ success: true, data: task });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    // Student PUT /api/task/:taskId
    // Then check if the task is a class task;
    // if it is, update completion on the teacher's side
    // if not, update title, description etc. on the student's side since it is not a class task
    case "PUT":
      try {
        const { student, completed } = req.body;
        const task = await Task.findByIdAndUpdate(taskId, req.body, {
          new: true,
          runValidators: true,
        });
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
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    // Student DELETE /api/task/:taskId
    // This only deletes personal tasks
    case "DELETE":
      try {
        const task = await Task.findByIdAndDelete(taskId);
        if (!task) {
          return res.status(404).json({
            success: false,
            message: "Task not found",
          });
        }
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: "Bad request" });
      break;
  }
}

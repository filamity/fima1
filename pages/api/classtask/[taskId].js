import dbConnect from "../../../utils/dbConnect";
import Task from "../../../models/Task";
import ClassTask from "../../../models/ClassTask";
import User from "../../../models/User";

dbConnect();

export default async function (req, res) {
  const {
    query: { taskId },
    method,
  } = req;

  switch (method) {
    // Teacher GET /api/classtask/:taskId
    case "GET":
      try {
        const classTask = await ClassTask.findById(taskId);
        if (!classTask) {
          return res.status(404).json({
            success: false,
            message: "Task not found",
          });
        }
        res.status(200).json({ success: true, data: classTask });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    // Teacher PUT /api/classtask/:taskId
    // Then update the task on students' side
    case "PUT":
      try {
        const classTask = await ClassTask.findByIdAndUpdate(taskId, req.body, {
          new: true,
          runValidators: true,
        });
        if (!classTask) {
          return res
            .status(400)
            .json({ success: false, message: "No task found" });
        }
        Task.find({ classTask: taskId }).then((tasks) => {
          tasks.forEach(async (task) => {
            await Task.findByIdAndUpdate(task._id, req.body, {
              new: true,
              runValidators: true,
            });
          });
        });
        res.status(200).json({ success: true, data: classTask });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    // Teacher DELETE /api/classtask/:taskId
    // Then delete the task on students' side
    case "DELETE":
      try {
        const classTask = await ClassTask.findByIdAndDelete(taskId);
        if (!classTask) {
          return res
            .status(400)
            .json({ success: false, message: "No task found" });
        }
        const deletionList = (await Task.find({ classTask: taskId })).map(
          (task) => task._id.toString()
        );
        User.find({ role: "student" }).then((users) => {
          users.forEach((user) => {
            user.tasks = user.tasks.filter(
              (task) => !deletionList.includes(task.toString())
            );
            user.save();
          });
        });
        await Task.deleteMany({ classTask: taskId });
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, message: "Bad request" });
  }
}

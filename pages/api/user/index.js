import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import ClassTask from "../../../models/ClassTask";
import Task from "../../../models/Task";

dbConnect();

export default async function (req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      const { role = "student" } = req.query;
      try {
        const users = await User.find({ role });
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;
    // Register a new user POST /api/user
    // Encrypts password and creates a new user
    // Then for each existing class task
    // Creates the corresponding task in global tasks bucket
    // Then adds the task to the user's personal tasks bucket
    // Lastly adds the user to the completeStatus of the class task
    // Returns JWT token
    case "POST":
      try {
        const { firstName, lastName, username, password, role, avatar } =
          req.body;
        const encryptedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
          avatar: avatar || null,
          firstName,
          lastName,
          username,
          password: encryptedPassword,
          role,
          tasks: [],
          notes: [],
        });
        const classTasks = await ClassTask.find({});
        for (let i = 0; i < classTasks.length; i++) {
          const task = await Task.create({
            title: classTasks[i].title,
            description: classTasks[i].description,
            createdAt: classTasks[i].createdAt,
            dueAt: classTasks[i].dueAt,
            classTask: classTasks[i]._id,
            user: user._id,
          });
          await User.findByIdAndUpdate(
            user._id,
            { $push: { tasks: task._id } },
            { new: true }
          );
          await ClassTask.findByIdAndUpdate(
            classTasks[i]._id,
            {
              $push: {
                completeStatus: {
                  student: user._id,
                  completed: false,
                },
              },
            },
            { new: true }
          );
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.status(201).json({ success: true, data: token });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, message: "Bad request" });
      break;
  }
}

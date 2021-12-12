import dbConnect from "../../../utils/dbConnect";
import Task from "../../../models/Task";

dbConnect();

export default async function (req, res) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const tasks = await Task.find({});
        res.status(200).json({ success: true, data: tasks });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: "Bad Request" });
      break;
  }
}

import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";

dbConnect();

export default async function (req, res) {
  const {
    query: { userId },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const user = await User.findById(userId);
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case "PUT":
      try {
        const user = await User.findByIdAndUpdate(userId, req.body, {
          new: true,
        });
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case "DELETE":
      try {
        await User.findByIdAndDelete(userId);
        res.status(204).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: "Bad request" });
      break;
  }
}

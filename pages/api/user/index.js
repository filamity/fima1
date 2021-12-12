import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";
import jwt from "jsonwebtoken";

dbConnect();

export default async function (req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const users = await User.find({});
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;
    case "POST":
      try {
        const { firstName, lastName, username, password, role } = req.body;
        const user = await User.create({
          firstName,
          lastName,
          username,
          password,
          role,
          tasks: [],
          notes: [],
        });
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

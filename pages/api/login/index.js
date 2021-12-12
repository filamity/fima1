import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";
import jwt from "jsonwebtoken";

dbConnect();

export default async function (req, res) {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ success: true, data: token });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
}

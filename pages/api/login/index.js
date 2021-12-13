import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dbConnect();

export default async function (req, res) {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (isPasswordValid) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ success: true, data: token });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
}

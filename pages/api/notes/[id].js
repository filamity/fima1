import dbConnect from "../../../utils/dbConnect";
import Note from "../../../models/Note";
import User from "../../../models/User";

dbConnect();

export default async function (req, res) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const notes = await Note.find({ user: id });
        res.status(200).json({ success: true, data: notes });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "POST":
      try {
        const user = await User.findById(id);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }
        const note = await Note.create({ ...req.body, user: id });
        await User.findByIdAndUpdate(
          id,
          { $push: { notes: note._id } },
          { new: true }
        );
        res.status(201).json({ success: true, data: note });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "PUT":
      try {
        const note = await Note.findByIdAndUpdate(
          id,
          { ...req.body },
          { new: true, runValidators: true }
        );
        if (!note) {
          return res
            .status(400)
            .json({ success: false, message: "No note found" });
        }
        res.status(200).json({ success: true, data: note });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case "DELETE":
      try {
        const note = await Note.findByIdAndDelete(id);
        if (!note) {
          return res
            .status(400)
            .json({ success: false, message: "No note found" });
        }
        await User.findByIdAndUpdate(
          note.user,
          { $pull: { notes: note._id } },
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

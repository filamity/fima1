import dbConnect from "../../../utils/dbConnect";
import Announcement from "../../../models/Announcement";

dbConnect();

export default async function (req, res) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const announcement = await Announcement.findById(id);
        if (!announcement) {
          return res
            .status(400)
            .json({ success: false, message: "Announcement not found" });
        }
        res.status(200).json({ success: true, data: announcement });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case "PUT":
      try {
        const announcement = await Announcement.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!announcement) {
          return res
            .status(400)
            .json({ success: false, message: "Announcement not found" });
        }
        res.status(200).json({ success: true, data: announcement });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case "DELETE":
      try {
        const announcement = await Announcement.deleteOne({ _id: id });
        if (!announcement) {
          return res
            .status(400)
            .json({ success: false, message: "Announcement not found" });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, message: "Bad Request" });
      break;
  }
}

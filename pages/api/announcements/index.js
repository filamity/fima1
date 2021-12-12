import dbConnect from "../../../utils/dbConnect";
import Announcement from "../../../models/Announcement";

dbConnect();

export default async function (req, res) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const announcements = await Announcement.find({});
        res.status(200).json({ success: true, data: announcements });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "POST":
      try {
        const announcement = await Announcement.create(req.body);
        res.status(201).json({ success: true, data: announcement });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: "Bad Request" });
      break;
  }
}

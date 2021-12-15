import dbConnect from "../../../utils/dbConnect";
import Image from "../../../models/Image";

dbConnect();

export default async function (req, res) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const images = await Image.find({});
        res.status(200).json({ success: true, data: images });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "POST":
      try {
        const image = await Image.create(req.body);
        res.status(201).json({ success: true, data: image });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, message: "Method not allowed" });
      break;
  }
}

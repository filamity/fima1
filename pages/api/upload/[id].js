import dbConnect from "../../../utils/dbConnect";
import Image from "../../../models/Image";

dbConnect();

export default async function (req, res) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const image = await Image.findById(id);
        res.status(200).json({ success: true, data: image });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "DELETE":
      try {
        const image = await Image.findByIdAndDelete(id);
        res.status(200).json({ success: true, data: image });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: "Method not allowed" });
      break;
  }
}

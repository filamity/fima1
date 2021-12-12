import dbConnect from "../../../utils/dbConnect";
import Read from "../../../models/Read";

dbConnect();

export default async function (req, res) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const reads = await Read.find({});
        res.status(200).json({ success: true, data: reads });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "POST":
      try {
        const read = await Read.create(req.body);
        res.status(201).json({ success: true, data: read });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: "Bad Request" });
      break;
  }
}

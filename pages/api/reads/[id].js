import dbConnect from "../../../utils/dbConnect";
import Read from "../../../models/Read";

dbConnect();

export default async function (req, res) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const read = await Read.findById(id);
        if (!read) {
          return res
            .status(400)
            .json({ success: false, message: "Read not found" });
        }
        res.status(200).json({ success: true, data: read });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case "PUT":
      try {
        const read = await Read.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!read) {
          return res
            .status(400)
            .json({ success: false, message: "Read not found" });
        }
        res.status(200).json({ success: true, data: read });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case "DELETE":
      try {
        const read = await Read.deleteOne({ _id: id });
        if (!read) {
          return res
            .status(400)
            .json({ success: false, message: "Read not found" });
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

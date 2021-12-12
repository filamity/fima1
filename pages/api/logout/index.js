import dbConnect from "../../../utils/dbConnect";

dbConnect();

export default async function (req, res) {
  res.status(200).json({ success: true });
}

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema(
  {
    avatar: { type: String, default: "/static/images/defaultavatar.png" },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    notes: [{ type: Schema.Types.ObjectId, ref: "Note" }],
  },
  { collection: "users" }
);

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);

import mongoose from "mongoose";

async function dbConnect() {
  try {
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("=> database connected");
  } catch (error) {
    console.log("=> database not connected");
  }
}

export default dbConnect;

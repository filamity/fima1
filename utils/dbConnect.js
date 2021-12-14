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

  // if (connection.isConnected) {
  //   console.log("=> using existing database connection");
  //   return;
  // }

  // const db = await mongoose.connect(process.env.MONGODB_URI, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });

  // connection.isConnected = db.connections[0].readyState;
  // console.log(
  //   connection.isConnected
  //     ? "=> database connected"
  //     : "=> database not connected"
  // );
}

export default dbConnect;

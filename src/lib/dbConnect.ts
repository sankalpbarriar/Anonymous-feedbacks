import mongoose from "mongoose";

//typescript part
type ConnectionObject = {
  isConnected?: number; //agar aayegi to number format me hi aayegi
};

const connection: ConnectionObject = {}; //connection object

//Database connection
async function dbConnect(): Promise<void> {
  //check if connection is already established
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    //connect to database logic
    const db = await mongoose.connect(process.env.MONGO_URI || "", {});
    console.log(db.connection);

    connection.isConnected = db.connections[0].readyState;     //number hota hai

    console.log("Db connected successfully");
  } catch (error) {
    console.log("DB connection failer",error);
    process.exit(1);
  }
}

export default dbConnect;

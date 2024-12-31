import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

export async function connectToDatabase() {
  try {
    const opts = {
      bufferCommands: false,
    };

    const conn = await mongoose.connect(MONGODB_URI, opts);
    console.log("MongoDB 연결 성공");
    return conn;
  } catch (error) {
    console.error("MongoDB 연결 실패:", error);
    throw error;
  }
}

const clientPromise = (async () => {
  try {
    const conn = await connectToDatabase();
    return conn.connection.client;
  } catch (error) {
    throw error;
  }
})();

export default clientPromise;

import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  connectTimeoutMS: 10000,
  socketTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
  maxPoolSize: 50,
  minPoolSize: 10,
  retryWrites: true,
  retryReads: true,
  w: "majority",
};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch((err) => {
      console.error("MongoDB 연결 실패:", err);
      throw err;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch((err) => {
    console.error("MongoDB 연결 실패:", err);
    throw err;
  });
}

export default clientPromise;

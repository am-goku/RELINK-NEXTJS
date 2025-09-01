import mongoose from "mongoose";

declare global {
  var mongooseConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Avoid re-declaring in hot reload
const globalWithMongoose = global as typeof globalThis & {
  mongooseConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

if (!globalWithMongoose.mongooseConnection) {
  globalWithMongoose.mongooseConnection = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (globalWithMongoose.mongooseConnection.conn) {
    return globalWithMongoose.mongooseConnection.conn;
  }

  if (!globalWithMongoose.mongooseConnection.promise) {
    globalWithMongoose.mongooseConnection.promise = mongoose
      .connect(process.env.MONGODB_URI as string, {
        dbName: "relink",
      })
      .then((mongoose) => mongoose);
  }

  globalWithMongoose.mongooseConnection.conn = await globalWithMongoose.mongooseConnection.promise;

  return globalWithMongoose.mongooseConnection.conn;
};

import mongoose from "mongoose";

declare const process: {
  env: {
    MONGO_URI: string;
  };
  exit(code?: number): never;
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
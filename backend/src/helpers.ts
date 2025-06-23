import mongoose from "mongoose";
import config from "./config";
export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodbConnectionString);
  } catch (e) {
    throw e;
  }
};

import { env } from "bun";
import mongoose from "mongoose";
import { logger } from "./logger";

const mongoURI = env.MONGO_URI;

async function connectMongo() {
  try {
    // const opts: mongoose.ConnectOptions = {};
    await mongoose.connect(mongoURI);
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error(error);
  }
}

export default connectMongo;

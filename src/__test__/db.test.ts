import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
} from "bun:test";
import mongoose from "mongoose";
import Book from "../models/book";
import Category from "../models/category";

const MONGO_DB_URL = "mongodb://root:example@localhost:27017";
describe("Database", () => {
  beforeAll(async () => {
    await mongoose.connect(MONGO_DB_URL);
  });

  afterEach(async () => {
    await Category.deleteMany({});
    await Book.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should connect to the database", async () => {
    expect(mongoose.connection.readyState).toBe(1); // 1 means connected
  });

  it("should disconnect from the database", async () => {
    await mongoose.disconnect();
    expect(mongoose.connection.readyState).toBe(0); // 0 means disconnected

    // Reconnect for other tests
    await mongoose.connect(MONGO_DB_URL);
  });

  it("should handle connection errors gracefully", async () => {
    await mongoose.disconnect();

    // Try to connect to a non-existent server
    try {
      await mongoose.connect("mongodb://nonexistent:27017/test", {
        serverSelectionTimeoutMS: 1000, // Low timeout for faster test
      });
      // If we reach here, connection somehow succeeded which is unexpected
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeTruthy();
    }

    // Reconnect for other tests
    await mongoose.connect(MONGO_DB_URL);
  });
});

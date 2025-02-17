import { logger } from "../../src/configs/logger";
import connectMongo from "../../src/configs/mongo";
import Book from "../../src/models/book";
import Category from "../../src/models/category";
import data from "./data.json";

async function seedData() {
  try {
    await connectMongo();
    await Category.deleteMany({});
    await Book.deleteMany({});

    logger.info("Cleared existing data");

    const categories = await Category.insertMany(data.categories);
    logger.info("Inserted categories");

    const books = await Book.insertMany(
      data.books.map((book) => ({
        ...book,
        published: new Date(book.published),
      }))
    );
    logger.info("Inserted books");

    for (const book of books) {
      if (Array.isArray(book.categories)) {
        for (const categoryId of book.categories) {
          await Category.findByIdAndUpdate(
            categoryId,
            { $push: { books: book._id } },
            { new: true }
          );
        }
      }
    }
    logger.info("Updated categories with book references");

    logger.info("Seeding complete!");
    process.exit(0);
  } catch (error) {
    logger.error("Error seeding data:", error);
    process.exit(1);
  }
}

seedData();

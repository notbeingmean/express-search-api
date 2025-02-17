import Book from "../models/book";
import Category from "../models/category";
import type { Book as BookType } from "../types/book";

const basepopulated = {
  _id: 1,
  name: 1,
  createdAt: 1,
};

async function getBooks(limit: number, page: number) {
  const skip = (page - 1) * limit;
  const [books, total] = await Promise.all([
    Book.find().populate("categories", basepopulated).skip(skip).limit(limit),
    Book.countDocuments(),
  ]);

  return {
    books,
    total,
  };
}

async function searchBooks(query: unknown, limit: number, page: number) {
  const skip = (page - 1) * limit;

  const searchPipeline = [
    {
      $search: {
        index: "default",
        text: {
          query: query,
          path: ["title", "author", "description", "categories.name"],
          fuzzy: { maxEdits: 1, prefixLength: 2 },
          score: { boost: { value: 1.5 } },
        },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "categories",
        foreignField: "_id",
        as: "category",
        pipeline: [{ $project: basepopulated }],
      },
    },
    {
      $project: {
        title: 1,
        author: 1,
        description: 1,
        published: 1,
        pages: 1,
        category: 1,
        createdAt: 1,
      },
    },
    { $skip: skip },
    { $limit: limit },
  ];

  const books = await Book.aggregate(searchPipeline);
  const total = books.length;

  return {
    books,
    total,
  };
}

async function getBookById(id: string) {
  const book = await Book.findById(id).populate("categories", basepopulated);

  return book;
}

async function createBook(data: BookType) {
  const book = new Book({
    ...data,
    published: new Date(data.published),
  });

  await book.save();

  await Category.updateMany(
    { _id: { $in: data.categories } },
    { $push: { books: book._id } }
  );

  return {
    message: "Book created successfully",
    status: 201,
  };
}

async function updateBook(id: string, data: BookType) {
  await Book.findByIdAndUpdate(id, data, { new: true }).populate(
    "categories",
    basepopulated
  );

  return {
    message: "Book updated successfully",
    status: 200,
  };
}

async function deleteBook(id: string) {
  await Book.findByIdAndDelete(id);

  return {
    message: "Book deleted successfully",
    status: 200,
  };
}
export {
  getBooks,
  getBookById,
  searchBooks,
  createBook,
  updateBook,
  deleteBook,
};

import { describe, expect, mock, beforeEach, it } from "bun:test";
import {
  getBooks,
  getBookById,
  searchBooks,
  createBook,
  updateBook,
  deleteBook,
} from "./book";
import Book from "../models/book";
import Category from "../models/category";

// Mock the MongoDB models
mock.module("../models/book", () => ({
  default: {
    find: mock(() => ({
      populate: mock(() => ({
        skip: mock(() => ({
          limit: mock(() => [
            {
              _id: "1",
              title: "Test Book",
              author: "Test Author",
              categories: [{ _id: "1", name: "Fiction" }],
            },
          ]),
        })),
      })),
    })),
    countDocuments: mock(() => 1),
    aggregate: mock(() => [
      {
        _id: "1",
        title: "Test Book",
        author: "Test Author",
        categories: [{ _id: "1", name: "Fiction" }],
      },
    ]),
    findById: mock(() => {
      const mockBook = {
        _id: "1",
        title: "Test Book",
        author: "Test Author",
        categories: [{ _id: "1", name: "Fiction" }],
      };
      return {
        populate: mock(() => mockBook),
      };
    }),
    findByIdAndUpdate: mock(() => ({
      populate: mock(() => ({
        _id: "1",
        title: "Updated Book",
        author: "Updated Author",
      })),
    })),
    findByIdAndDelete: mock(() => true),
  },
}));

mock.module("../models/category", () => ({
  default: {
    updateMany: mock(() => true),
  },
}));

describe("Book Handler", () => {
  describe("getBooks", () => {
    it("should return books with pagination", async () => {
      const result = await getBooks(10, 1);
      expect(result.books).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe("searchBooks", () => {
    it("should return search results", async () => {
      const result = await searchBooks("test", 10, 1);
      expect(result.books).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe("getBookById", () => {
    it("should return a book by id", async () => {
      const book = await getBookById("1");
      expect(book).toBeDefined();
      if (book) {
        expect(book.title).toBe("Test Book");
      }
    });
  });

  describe("updateBook", () => {
    it("should update a book", async () => {
      const mockUpdate = {
        title: "Updated Book",
        author: "Updated Author",
        description: "Updated description",
        published: "2024-02-24",
        pages: 250,
        categories: ["1", "2"],
        createdAt: new Date(),
      };

      const result = await updateBook("1", mockUpdate);
      expect(result.status).toBe(200);
      expect(result.message).toBe("Book updated successfully");
    });
  });

  describe("deleteBook", () => {
    it("should delete a book", async () => {
      const result = await deleteBook("1");
      expect(result.status).toBe(200);
      expect(result.message).toBe("Book deleted successfully");
    });
  });
  describe("createBook", () => {
    beforeEach(() => {
      // Reset mocks before each test
      mock.restore();
    });

    it("should create a new book successfully", async () => {
      const saveMock = mock(() => Promise.resolve());

      mock.module("../models/book", () => ({
        default: class {
          constructor() {
            return {
              _id: "123",
              save: saveMock,
            };
          }
        },
      }));

      const mockBook = {
        title: "Test Book",
        author: "Test Author",
        description: "Test description",
        published: "2024-02-24",
        pages: 200,
        categories: ["1", "2"],
        createdAt: new Date(),
      };

      const result = await createBook(mockBook);

      expect(result.status).toBe(201);
      expect(result.message).toBe("Book created successfully");
      expect(saveMock).toHaveBeenCalled();
    });

    it("should update categories when creating book", async () => {
      const categoryUpdateMock = mock(() => Promise.resolve());

      mock.module("../models/category", () => ({
        default: {
          updateMany: categoryUpdateMock,
        },
      }));

      const mockBook = {
        title: "Test Book",
        author: "Test Author",
        description: "Test description",
        published: "2024-02-24",
        pages: 200,
        categories: ["1", "2"],
        createdAt: new Date(),
      };

      await createBook(mockBook);

      expect(categoryUpdateMock).toHaveBeenCalledWith(
        { _id: { $in: ["1", "2"] } },
        { $push: { books: "123" } }
      );
    });

    it("should convert published date to Date object", async () => {
      const constructorSpy = mock(() => ({
        _id: "123",
        save: mock(() => Promise.resolve()),
      }));

      mock.module("../models/book", () => ({
        default: constructorSpy,
      }));

      const mockBook = {
        title: "Test Book",
        author: "Test Author",
        description: "Test description",
        published: "2024-02-24",
        pages: 100,
        categories: [],
        createdAt: new Date(),
      };

      await createBook(mockBook);

      const expectedDate = new Date("2024-02-24");
      expect(constructorSpy).toHaveBeenCalledWith({
        ...mockBook,
        published: expectedDate,
      });
    });
  });
});

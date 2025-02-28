import { describe, expect, mock, beforeEach, it } from "bun:test";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./category";
import Category from "../models/category";
import Book from "../models/book";

// Mock the MongoDB models
mock.module("../models/category", () => ({
  default: {
    find: mock(() => ({
      populate: mock(() => ({
        skip: mock(() => ({
          limit: mock(() => [
            {
              _id: "1",
              name: "Fiction",
              books: [{ _id: "1", title: "Test Book", author: "Test Author" }],
            },
          ]),
        })),
      })),
    })),
    countDocuments: mock(() => 1),
    findById: mock(() => {
      const mockCategory = {
        _id: "1",
        name: "Fiction",
        books: [{ _id: "1", title: "Test Book", author: "Test Author" }],
      };
      return {
        populate: mock(() => mockCategory),
      };
    }),
    findByIdAndUpdate: mock(() => ({
      populate: mock(() => ({
        _id: "1",
        name: "Updated Fiction",
      })),
    })),
    findByIdAndDelete: mock(() => true),
  },
}));

mock.module("../models/book", () => ({
  default: {
    updateMany: mock(() => true),
  },
}));

describe("Category Handler", () => {
  describe("getCategories", () => {
    it("should return categories with pagination", async () => {
      const result = await getCategories(10, 1);
      expect(result.categories).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe("getCategoryById", () => {
    it("should return a category by id", async () => {
      const category = await getCategoryById("1");
      expect(category).toBeDefined();
      if (category) {
        expect(category.name).toBe("Fiction");
        expect(category.books).toHaveLength(1);
      }
    });
  });

  describe("createCategory", () => {
    beforeEach(() => {
      mock.restore();
    });

    it("should create a new category successfully", async () => {
      const saveMock = mock(() => Promise.resolve());

      mock.module("../models/category", () => ({
        default: class {
          constructor() {
            return {
              _id: "123",
              save: saveMock,
            };
          }
        },
      }));

      const mockCategory = {
        name: "Science Fiction",
      };

      const result = await createCategory(mockCategory);

      expect(result.status).toBe(201);
      expect(result.message).toBe("Category created successfully");
      expect(saveMock).toHaveBeenCalled();
    });
  });

  describe("updateCategory", () => {
    beforeEach(() => {
      mock.restore();
    });

    it("should update a category", async () => {
      const mockUpdate = {
        name: "Updated Fiction",
      };

      const categoryUpdateMock = mock(() => ({
        populate: mock(() => ({
          _id: "1",
          name: "Updated Fiction",
        })),
      }));

      mock.module("../models/category", () => ({
        default: {
          findByIdAndUpdate: categoryUpdateMock,
        },
      }));

      const result = await updateCategory("1", mockUpdate);
      expect(result.status).toBe(200);
      expect(result.message).toBe("Category updated successfully");
      expect(categoryUpdateMock).toHaveBeenCalledWith("1", mockUpdate, {
        new: true,
      });
    });
  });

  describe("deleteCategory", () => {
    beforeEach(() => {
      mock.restore();
    });

    it("should delete a category and update book references", async () => {
      const bookUpdateMock = mock(() => Promise.resolve());
      const categoryFindByIdMock = mock(() => ({
        _id: "1",
        name: "Fiction",
      }));
      const categoryDeleteMock = mock(() => Promise.resolve());

      mock.module("../models/category", () => ({
        default: {
          findById: categoryFindByIdMock,
          findByIdAndDelete: categoryDeleteMock,
        },
      }));

      mock.module("../models/book", () => ({
        default: {
          updateMany: bookUpdateMock,
        },
      }));

      const result = await deleteCategory("1");

      expect(result.status).toBe(200);
      expect(result.message).toBe("Category deleted successfully");
      expect(bookUpdateMock).toHaveBeenCalledWith(
        { categories: "1" },
        { $pull: { categories: "1" } }
      );
      expect(categoryDeleteMock).toHaveBeenCalledWith("1");
    });

    it("should return not found for non-existent category", async () => {
      mock.module("../models/category", () => ({
        default: {
          findById: mock(() => null),
        },
      }));

      const result = await deleteCategory("999");
      expect(result.status).toBe(404);
      expect(result.message).toBe("Category not found");
    });
  });
});

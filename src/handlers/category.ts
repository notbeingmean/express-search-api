import Category from "../models/category";
import Book from "../models/book";
import type { Category as CategoryType } from "../types/category";

const basepopulated = {
  _id: 1,
  title: 1,
  author: 1,
  createdAt: 1,
};

async function getCategories(limit: number, page: number) {
  const skip = (page - 1) * limit;
  const [categories, total] = await Promise.all([
    Category.find().populate("books", basepopulated).skip(skip).limit(limit),
    Category.countDocuments(),
  ]);

  return {
    categories,
    total,
  };
}

async function getCategoryById(id: string) {
  const category = await Category.findById(id).populate("books", basepopulated);

  return category;
}

async function createCategory(data: CategoryType) {
  const category = new Category(data);
  await category.save();

  return {
    message: "Category created successfully",
    status: 201,
  };
}

async function updateCategory(id: string, data: CategoryType) {
  await Category.findByIdAndUpdate(id, data, { new: true }).populate(
    "books",
    basepopulated
  );

  return {
    message: "Category updated successfully",
    status: 200,
  };
}

async function deleteCategory(id: string) {
  const category = await Category.findById(id);
  if (!category) {
    return {
      message: "Category not found",
      status: 404,
    };
  }

  // Remove category reference from all associated books
  await Book.updateMany({ categories: id }, { $pull: { categories: id } });

  await Category.findByIdAndDelete(id);

  return {
    message: "Category deleted successfully",
    status: 200,
  };
}

export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

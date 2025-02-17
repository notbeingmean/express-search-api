import Router from "express";
import Category from "../models/category";

const categoryRouter = Router();

categoryRouter.get("/", async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("books", {
        _id: 1,
        title: 1,
        author: 1,
        description: 1,
        published: 1,
        pages: 1,
        createdAt: 1,
      })
      .select({
        _id: 1,
        name: 1,
        createdAt: 1,
      });
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch categories" });
  }
});

categoryRouter.post("/", async (req, res) => {
  try {
    const category = await Category.create(req.body);
    return res.status(201).json(category);
  } catch (error) {
    return res.status(400).json({ error: "Failed to create category" });
  }
});

categoryRouter.patch("/:id", async (req, res) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, req.body);
    return res.json({ status: "success", message: "Category updated" });
  } catch (error) {
    return res.status(400).json({ error: "Failed to update category" });
  }
});

categoryRouter.delete("/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    return res.json({ status: "success", message: "Category deleted" });
  } catch (error) {
    return res.status(400).json({ error: "Failed to delete category" });
  }
});

export default categoryRouter;

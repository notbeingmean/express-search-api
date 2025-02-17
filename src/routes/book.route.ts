import { Router, type Request, type Response } from "express";
import { bookSchema } from "../types/book";
import {
  createBook,
  deleteBook,
  getBookById,
  getBooks,
  searchBooks,
  updateBook,
} from "../handlers/book";

const bookRouter = Router();

bookRouter.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { books, total } = await getBooks(limit, page);

    const totalPages = Math.ceil(total / limit);

    return res.json({
      data: books,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch books",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

bookRouter.get("/search", async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q)
      return res.status(400).json({
        error: "Query parameter 'q' is required",
      });

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { books, total } = await searchBooks(q, limit, page);

    return res.json({
      data: books,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to search books",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

bookRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const book = await getBookById(id);

    return res.json(book);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch book",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

bookRouter.post("/", async (req, res) => {
  try {
    const checkBook = bookSchema.parse(req.body);

    if (!checkBook) {
      return res.status(400).json({
        error: "Invalid book schema",
      });
    }

    const data = await createBook(checkBook);

    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create book",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

bookRouter.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const checkBook = bookSchema.parse(req.body);

    if (!checkBook) {
      return res.status(400).json({
        error: "Invalid book schema",
      });
    }

    const data = await updateBook(id, checkBook);

    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to update book",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

bookRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await deleteBook(id);

    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete book",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default bookRouter;

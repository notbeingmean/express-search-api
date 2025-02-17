import { Router } from "express";
import bookRouter from "./book.route";
import categoryRouter from "./category.route";

const router = Router();

router.use("/books", bookRouter);
router.use("/categories", categoryRouter);

router.get("/healcheck", (req, res) => {
  res.json({ status: "ok" });
});

router.get("*", (_, res) => {
  res.status(404).json({ message: "Not Found" });
});

export default router;

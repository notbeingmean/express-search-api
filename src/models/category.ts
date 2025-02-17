import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "categories",
    versionKey: false,
  }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;

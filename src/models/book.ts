import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    published: {
      type: Date,
      required: true,
    },
    pages: {
      type: Number,
      required: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "books",
    versionKey: false,
  }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;

import { z } from "zod";

export const bookSchema = z.object({
  _id: z.string().optional(),
  title: z.string().trim(),
  author: z.string().trim(),
  description: z.string().trim(),
  published: z.string(), // example: "1952-01-01"
  pages: z.number(),
  categories: z.array(z.string()),
  createdAt: z.date().default(() => new Date()),
});

export type Book = z.infer<typeof bookSchema>;

export type Book = {
  _id: string;
  title: string;
  author: string;
  description: string;
  published: string;
  pages: number;
  categories: {
    _id: string;
    name: string;
    createdAt: string;
  }[];
  createdAt: string;
};

export type Pagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
};

export type BookResponse = {
  data: Book[];
  pagination: Pagination;
};

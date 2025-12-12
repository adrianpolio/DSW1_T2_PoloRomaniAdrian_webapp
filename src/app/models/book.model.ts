
export interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    stock: number;
    createdAt: string;
  }
  
  export interface CreateBookDto {
    title: string;
    author: string;
    isbn: string;
    stock: number;
  }
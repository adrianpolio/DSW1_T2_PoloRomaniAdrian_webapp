
  export interface Loan {
    id: number;
    bookId: number;
    bookTitle: string;
    studentName: string;
    loanDate: string;
    returnDate: string | null;
    status: string;
    createdAt: string;
  }
  
  export interface CreateLoanDto {
    bookId: number;
    studentName: string;
  }
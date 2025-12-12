import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanService } from '../../services/loan.service';
import { BookService } from '../../services/book.service';
import { Loan, CreateLoanDto } from '../../models/loan.model';
import { Book } from '../../models/book.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.scss']
})
export class LoansComponent implements OnInit {
  loans: Loan[] = [];
  books: Book[] = [];
  loading = false;
  showModal = false;

  loanForm: CreateLoanDto = {
    bookId: 0,
    studentName: ''
  };

  constructor(
    private loanService: LoanService,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.loadLoans();
    this.loadBooks();
  }

  loadLoans(): void {
    this.loading = true;
    this.loanService.getActiveLoans().subscribe({
      next: (data) => {
        this.loans = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading loans:', error);
        this.loading = false;
        Swal.fire('Error', 'Failed to load loans', 'error');
      }
    });
  }

  loadBooks(): void {
    this.bookService.getAllBooks().subscribe({
      next: (data) => {
        this.books = data.filter(book => book.stock > 0);
      },
      error: (error) => {
        console.error('Error loading books:', error);
      }
    });
  }

  openCreateModal(): void {
    this.loanForm = {
      bookId: 0,
      studentName: ''
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.loanForm = {
      bookId: 0,
      studentName: ''
    };
  }

  createLoan(): void {
    if (this.loanForm.bookId === 0 || !this.loanForm.studentName) {
      Swal.fire('Error', 'Please fill all fields', 'error');
      return;
    }

    this.loanService.createLoan(this.loanForm).subscribe({
      next: () => {
        Swal.fire('Success', 'Loan created successfully', 'success');
        this.loadLoans();
        this.loadBooks();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error creating loan:', error);
        Swal.fire('Error', error.error?.message || 'Failed to create loan', 'error');
      }
    });
  }

  returnLoan(loan: Loan): void {
    Swal.fire({
      title: 'Return Book',
      text: `Mark "${loan.bookTitle}" as returned by ${loan.studentName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#48bb78',
      cancelButtonColor: '#cbd5e0',
      confirmButtonText: 'Yes, return it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loanService.returnLoan(loan.id).subscribe({
          next: () => {
            Swal.fire('Returned!', 'Book has been returned successfully.', 'success');
            this.loadLoans();
            this.loadBooks();
          },
          error: (error) => {
            console.error('Error returning loan:', error);
            Swal.fire('Error', error.error?.message || 'Failed to return loan', 'error');
          }
        });
      }
    });
  }

  getDaysOnLoan(loanDate: string): number {
    const loan = new Date(loanDate);
    const today = new Date();
    const diff = Math.floor((today.getTime() - loan.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  }

  isOverdue(loanDate: string): boolean {
    return this.getDaysOnLoan(loanDate) > 14; // 14 days loan period
  }
}
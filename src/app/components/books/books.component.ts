
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { Book, CreateBookDto } from '../../models/book.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  loading = false;
  showModal = false;
  isEditMode = false;
  currentBookId: number | null = null;

  bookForm: CreateBookDto = {
    title: '',
    author: '',
    isbn: '',
    stock: 0
  };

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService.getAllBooks().subscribe({
      next: (data) => {
        this.books = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading books:', error);
        this.loading = false;
        Swal.fire('Error', 'Failed to load books', 'error');
      }
    });
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.currentBookId = null;
    this.bookForm = {
      title: '',
      author: '',
      isbn: '',
      stock: 0
    };
    this.showModal = true;
  }

  openEditModal(book: Book): void {
    this.isEditMode = true;
    this.currentBookId = book.id;
    this.bookForm = {
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      stock: book.stock
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.bookForm = {
      title: '',
      author: '',
      isbn: '',
      stock: 0
    };
    this.isEditMode = false;
    this.currentBookId = null;
  }

  saveBook(): void {
    if (this.isEditMode && this.currentBookId) {
      this.updateBook();
    } else {
      this.createBook();
    }
  }

  createBook(): void {
    this.bookService.createBook(this.bookForm).subscribe({
      next: () => {
        Swal.fire('Success', 'Book created successfully', 'success');
        this.loadBooks();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error creating book:', error);
        Swal.fire('Error', error.error?.message || 'Failed to create book', 'error');
      }
    });
  }

  updateBook(): void {
    if (!this.currentBookId) return;

    this.bookService.updateBook(this.currentBookId, this.bookForm).subscribe({
      next: () => {
        Swal.fire('Success', 'Book updated successfully', 'success');
        this.loadBooks();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error updating book:', error);
        Swal.fire('Error', error.error?.message || 'Failed to update book', 'error');
      }
    });
  }

  deleteBook(id: number, title: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bookService.deleteBook(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Book has been deleted.', 'success');
            this.loadBooks();
          },
          error: (error) => {
            console.error('Error deleting book:', error);
            Swal.fire('Error', error.error?.message || 'Failed to delete book', 'error');
          }
        });
      }
    });
  }
}
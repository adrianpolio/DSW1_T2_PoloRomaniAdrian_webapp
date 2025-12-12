import { Routes } from '@angular/router';
import { BooksComponent } from './components/books/books.component';
import { LoansComponent } from './components/loans/loans.component';

export const routes: Routes = [
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  { path: 'books', component: BooksComponent },
  { path: 'loans', component: LoansComponent },
  { path: '**', redirectTo: '/books' }
];
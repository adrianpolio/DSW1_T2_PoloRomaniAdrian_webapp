
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Loan, CreateLoanDto } from '../models/loan.model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = `${environment.apiUrl}/loans`;

  constructor(private http: HttpClient) { }

  getActiveLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/active`);
  }

  createLoan(loan: CreateLoanDto): Observable<Loan> {
    return this.http.post<Loan>(this.apiUrl, loan);
  }

  returnLoan(id: number): Observable<Loan> {
    return this.http.put<Loan>(`${this.apiUrl}/${id}/return`, {});
  }
}
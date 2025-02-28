import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BookResponse } from '../types/book';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  searchBooks(page: number = 1, query: string = ''): Observable<BookResponse> {
    return this.http.get<BookResponse>(
      `${this.apiUrl}/books/search?page=${page}&q=${query}`
    );
  }

  getBooks(page: number = 1): Observable<BookResponse> {
    return this.http.get<BookResponse>(`${this.apiUrl}/books?page=${page}`);
  }
}

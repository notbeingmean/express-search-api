import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookResponse } from '../../types/book';
import { BookCardComponent } from '../../components/book-card/book-card.component';
import { BookService } from '../../services/book.service';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-search',
  imports: [BookCardComponent, NgFor, FormsModule], // Removed duplicate NgForOf
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  books: BookResponse = {
    data: [],
    pagination: {
      currentPage: 0,
      totalPages: 0,
      totalItems: 0,
      itemsPerPage: 0,
    },
  };

  search = '';
  page = 1;

  constructor(
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ page = 1, q = '' }) => {
        this.page = Number(page);
        this.search = q;
        this.getProducts();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getProducts(): void {
    this.bookService
      .searchBooks(this.page, this.search)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.books = data;
      });
  }

  onSearch(): void {
    this.router.navigate(['search'], {
      queryParams: { q: this.search, page: 1 },
    });
  }
}

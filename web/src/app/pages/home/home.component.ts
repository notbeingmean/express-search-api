import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Data } from '../../types/product';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  obj: Data = {
    data: [],
    pagination: {
      currentPage: 0,
      totalPages: 0,
      totalItems: 0,
      itemsPerPage: 0,
    },
  };

  page = 1;

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.page = params['page'] || 1;
    });
    this.getBooks();
  }
  getBooks() {
    return this.http
      .get<Data>(`${this.apiUrl}/books?page=${this.page}`)
      .subscribe((data: Data) => {
        this.obj = data;
      });
  }

  nextPage() {
    this.page++;
    this.router.navigate(['.'], {
      queryParams: { page: this.page },
      queryParamsHandling: 'replace',
    });

    this.http
      .get<Data>(`${this.apiUrl}/books?page=${this.page}`)
      .subscribe((data: Data) => {
        this.obj = data;
      });
  }

  prevPage() {
    this.page--;

    this.router.navigate(['.'], {
      queryParams: { page: this.page },
      queryParamsHandling: 'replace',
    });
    this.http
      .get<Data>(`${this.apiUrl}/books?page=${this.page}`)
      .subscribe((data: Data) => {
        this.obj = data;
      });
  }
}

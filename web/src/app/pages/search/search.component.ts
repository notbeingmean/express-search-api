import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Data } from '../../types/product';
import { ProductSearchCardComponent } from '../../components/product-search-card/product-search-card.component';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-search',
  imports: [ProductSearchCardComponent, NgFor, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  private apiUrl = 'http://localhost:3000/api';
  obj: Data = {
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

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.page = params['page'] || 1;
      this.search = params['q'] || '';
    });

    this.getProducts();
    console.log(this.obj);
  }

  getProducts() {
    return this.http
      .get<Data>(
        `${this.apiUrl}/books/search?page=${this.page}&q=${this.search}`
      )
      .subscribe((data) => {
        this.obj = data;
      });
  }

  onSearch() {
    this.router.navigate(['search'], {
      queryParams: { q: this.search },
      queryParamsHandling: 'merge',
    });
    this.getProducts();
  }
}

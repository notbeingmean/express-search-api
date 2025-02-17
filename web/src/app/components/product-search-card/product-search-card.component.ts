import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../types/product';
import { NgFor } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-product-search-card',
  imports: [NgFor],
  templateUrl: './product-search-card.component.html',
})
export class ProductSearchCardComponent {
  constructor(private router: ActivatedRoute) {}

  @Input() product: Product | undefined;
  @Input() search?: string;

  highlightText(text: string): string {
    if (!this.search || !text) return text;
    const regex = new RegExp(this.search, 'gi');
    return text.replace(regex, (match) => `<mark>${match}</mark>`);
  }
}

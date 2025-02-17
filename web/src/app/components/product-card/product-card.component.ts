import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../types/product';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [NgFor],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  constructor() {}

  @Input() product: Product | undefined;
}

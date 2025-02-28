import { Component, Input } from '@angular/core';
import { Book } from '../../types/book';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [NgFor],
  template: `
    <div class="max-w-sm max-h-sm h-full rounded overflow-hidden shadow-lg p-4">
      <div
        class="font-bold text-xl mb-2"
        [innerHTML]="highlightText(book.title)"
      ></div>
      <p
        class="text-gray-700 text-base mb-2"
        [innerHTML]="highlightText(book.author)"
      ></p>
      <div class="text-gray-600 text-sm">
        <p>Published: {{ book.published }}</p>
        <p>Pages: {{ book.pages }}</p>
      </div>
      <div class="mt-2">
        <span
          *ngFor="let category of book.categories"
          class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          [innerHTML]="highlightText(category.name)"
        >
        </span>
      </div>
    </div>
  `,
})
export class BookCardComponent {
  @Input() book!: Book;
  @Input() search = '';

  highlightText(text: string): string {
    if (!this.search || !text) {
      return text;
    }

    const searchRegex = new RegExp(this.search, 'gi');
    return text.replace(
      searchRegex,
      (match) => `<span class="bg-yellow-200">${match}</span>`
    );
  }
}

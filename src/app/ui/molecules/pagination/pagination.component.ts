import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() totalPages!: number;
  @Input() currentPage!: number;
  @Output() pageChange = new EventEmitter<number>();

  changePage(page: number): void {
    this.pageChange.emit(page);
  }

  getPagesToShow(): number[] {
    const pages: number[] = [];
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;

    const addRange = (start: number, end: number) => {
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    };

    if (totalPages <= 5) {
      addRange(0, totalPages - 1);
    } else if (currentPage <= 2) {
      addRange(0, 4);
      pages.push(-1, totalPages - 1);
    } else if (currentPage >= totalPages - 3) {
      pages.push(0, -1);
      addRange(totalPages - 5, totalPages - 1);
    } else {
      pages.push(0, -1);
      addRange(currentPage - 1, currentPage + 1);
      pages.push(-1, totalPages - 1);
    }

    return pages;
  }
}
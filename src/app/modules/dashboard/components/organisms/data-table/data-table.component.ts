import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {

  @Input() data!: any[];
  @Input() columns!: { key: string; label: string; sortable?: boolean }[];
  @Input() totalPages!: number;
  @Input() currentPage!: number;
  @Input() isAscending!: boolean;
  @Input() sortBy!: string;

  @Output() pageChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  changePage(page: number): void {
    this.pageChange.emit(page);
  }

  onSortChange(sortBy: string): void {
    this.sortChange.emit(sortBy);
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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit {
  @Input() data!: any[];
  @Input() columns!: { key: string; label: string; sortable?: boolean }[];
  @Input() totalPages!: number;
  @Input() currentPage!: number;
  @Input() currentSort!: string;
  @Input() isAscending: boolean = true;

  @Output() pageChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<{
    sortBy: string;
    isAscending: boolean;
  }>();
  @Output() rowsPerPageChange = new EventEmitter<number>();

  rowsPerPage = 5;

  constructor() {}

  ngOnInit(): void {
    if (!this.currentSort && this.columns.length > 0) {
      this.currentSort = this.columns[0].key;
      this.isAscending = true;
    }
  }

  changePage(page: number): void {
    this.pageChange.emit(page);
  }

  onRowsPerPageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newRowsPerPage = target.value;
    this.rowsPerPage = Number(newRowsPerPage);
    this.rowsPerPageChange.emit(this.rowsPerPage);
    this.changePage(0);
  }

  onSortChange(sortBy: string): void {
    if (this.currentSort === sortBy) {
      this.isAscending = !this.isAscending;
    } else {
      this.currentSort = sortBy;
      this.isAscending = true;
    }

    this.sortChange.emit({
      sortBy: this.currentSort,
      isAscending: this.isAscending,
    });
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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '@/app/shared/services/auth/auth.service';
import { ROLES } from '@/app/shared/constants/roles.constants';

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
  @Input() showActions: boolean = false;

  @Output() pageChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<{
    sortBy: string;
    isAscending: boolean;
  }>();
  @Output() rowsPerPageChange = new EventEmitter<number>();
  @Output() incrementClick = new EventEmitter<any>();
  @Output() addToCartClick = new EventEmitter<any>();

  rowsPerPage = 5;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    if (!this.currentSort && this.columns.length > 0) {
      this.currentSort = this.columns[0].key;
      this.isAscending = true;
    }
  }

  onSortChange(sortBy: string): void {
    if (this.currentSort === sortBy) {
      this.isAscending = !this.isAscending;
    } else {
      this.currentSort = sortBy;
      this.isAscending = true;
    }

    this.sortChange.emit({
      sortBy,
      isAscending: this.isAscending,
    });
  }

  onIncrementClick(row: any): void {
    this.incrementClick.emit(row);
  }

  onAddToCartClick(row: any): void {
    this.addToCartClick.emit(row);
  }

  canShowActions(): boolean {
    return (
      this.showActions &&
      this.authService.getUserRole() === ROLES.WAREHOUSE_ASSISTANT
    );
  }

  canShowAddToCart(): boolean {
    return this.showActions && this.authService.getUserRole() === ROLES.USER;
  }
}

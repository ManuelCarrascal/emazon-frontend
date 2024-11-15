import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination-controls',
  templateUrl: './pagination-controls.component.html',
  styleUrls: ['./pagination-controls.component.scss'],
})
export class PaginationControlsComponent {
  @Input() rowsPerPageOptions: number[] = [5, 10];
  @Input() selectedRowsPerPage: number = 5;
  @Output() rowsPerPageChange = new EventEmitter<number>();

  onRowsPerPageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newRowsPerPage = Number(target.value);
    this.rowsPerPageChange.emit(newRowsPerPage);
  }
}
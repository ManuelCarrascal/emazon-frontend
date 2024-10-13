import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss']
})
export class TableHeaderComponent implements OnInit {
  @Input() columns!: { key: string; label: string; sortable?: boolean }[];
  @Input() currentSort!: string;
  @Input() isAscending!: boolean;
  @Output() sortChange = new EventEmitter<string>();

 

  constructor() { }

  ngOnInit(): void {
  }

  onSortChange(columnKey: string) {
    this.sortChange.emit(columnKey);
  }

}

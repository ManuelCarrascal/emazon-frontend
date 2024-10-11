import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss']
})
export class TableHeaderComponent implements OnInit {

  @Input() header!: string;
  @Output() sort = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
    // initialize
  }

  onSort(): void {
    this.sort.emit(this.header);
  }

}

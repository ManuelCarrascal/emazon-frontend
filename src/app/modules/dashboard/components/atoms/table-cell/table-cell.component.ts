import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-cell',
  templateUrl: './table-cell.component.html',
  styleUrls: ['./table-cell.component.scss']
})
export class TableCellComponent implements OnInit {
  @Input() content!: string | number;

  constructor() { }

  ngOnInit(): void {
  }

}

import { Category } from '@/app/modules/dashboard/interfaces/category.interface';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-row',
  templateUrl: './table-row.component.html',
  styleUrls: ['./table-row.component.scss']
})
export class TableRowComponent implements OnInit {

  @Input() row!: Category;
  @Input() headers: string[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
import { Category, Pagination } from '@/app/modules/dashboard/interfaces/category.interface';
import { CategoryService } from '@/app/modules/dashboard/services/category.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() headers: string[] = [];
  categories: Category[] = [];
  totalElements: number = 0;
  totalPages: number = 0;
  currentPage: number = 0;
  isAscending: boolean = true;
  sortBy: string = 'categoryName';
  pageSize: number = 5;

  constructor(private readonly categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService
      .getCategories(
        this.currentPage,
        this.pageSize,
        this.sortBy,
        this.isAscending
      )
      .subscribe((data: Pagination<Category>) => {
        this.categories = data.content;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
        this.currentPage = data.currentPage;
      });
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadCategories();
  }

  sort(column: string): void {
    if (this.sortBy === column) {
      this.isAscending = !this.isAscending;
    } else {
      this.sortBy = column;
      this.isAscending = true;
    }
    this.loadCategories();
  }
}
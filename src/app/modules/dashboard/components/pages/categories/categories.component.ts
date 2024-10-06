import { Component, OnInit } from '@angular/core';
import { Category } from '../../../interfaces/category.interface';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {

  category: Category = {
    categoryName: '',
    categoryDescription: '',
  }

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
  }

  createCategory() {
    this.categoryService.createCategory(this.category).subscribe(
      response => {
        console.log('Category created successfully', response);
        this.category = {
          categoryName: '',
          categoryDescription: '',
        };
        
      },
      error => {
        console.error('Error creating category', error);
      }
    );
  }

  updateCategoryName(newName: string) {
    this.category.categoryName = newName;
  }

  updateCategoryDescription(newDescription: string) {
    this.category.categoryDescription = newDescription;
  }

}

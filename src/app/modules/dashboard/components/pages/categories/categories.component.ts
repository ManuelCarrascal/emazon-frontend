import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  public createCategoryForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private toastService: ToastService
  ) {
    this.createCategoryForm = this.formBuilder.group({
      categoryName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[^'";<>\\-]+$/),
        ],
      ],
      categoryDescription: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[^'";<>\\-]+$/),
        ],
      ],
    });
  }

  ngOnInit(): void {}

  get categoryName() {
    return this.createCategoryForm.get('categoryName');
  }

  get categoryDescription() {
    return this.createCategoryForm.get('categoryDescription');
  }

  getErrorMessage(control: any, fieldName: string): string {
    if (control?.touched && control?.errors) {
      const firstKey = Object.keys(control.errors)[0];
      const error = control.errors[firstKey];
      return this.errorMessages[firstKey](fieldName, error);
    }
    return '';
  }

  createCategory(): void {
    if (this.createCategoryForm.invalid) {
      this.createCategoryForm.markAllAsTouched();
      return;
    }

    this.categoryService
      .createCategory(this.createCategoryForm.value)
      .subscribe(
        (response) => {
          this.toastService.showToast(
            'Category created successfully',
            'success'
          );
          this.createCategoryForm.reset();
        },
        (error) => {
          this.toastService.showToast(
            error.error.Message || 'Error creating category',
            'error'
          );
        }
      );
  }

  get categoryNameError(): string {
    return this.getErrorMessage(this.categoryName, 'Category Name');
  }

  get categoryDescriptionError(): string {
    return this.getErrorMessage(
      this.categoryDescription,
      'Category Description'
    );
  }

  private errorMessages: {
    [key: string]: (fieldName: string, error?: any) => string;
  } = {
    required: (fieldName: string) => `${fieldName} is required.`,
    minlength: (fieldName: string, error: any) =>
      `${fieldName} must be at least ${error.requiredLength} characters.`,
    pattern: (fieldName: string) =>
      `${fieldName} contains forbidden characters.`,
  };
}

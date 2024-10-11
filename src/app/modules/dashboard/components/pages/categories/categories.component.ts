import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { ToastService, ToastType } from 'src/app/core/services/toast.service';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Category } from '../../../interfaces/category.interface';
import {
  ERROR_MESSAGES,
  ERROR_MESSAGES_BY_CODE,
  SUCCESS_MESSAGES,
  REGEX_PATTERNS,
  FIELD_NAMES,
} from 'src/app/shared/constants/categoriesComponent';

const MIN_LENGTH = 3;

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  public createCategoryForm: FormGroup;
  public categories: Category[] = [];
  public totalElements: number = 0;
  public totalPages: number = 0;
  public currentPage: number = 0;
  public isAscending: boolean = true;
  public sortBy: string = 'categoryName';
  public pageSize: number = 5;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly categoryService: CategoryService,
    private readonly toastService: ToastService
  ) {
    this.createCategoryForm = this.formBuilder.group({
      categoryName: [
        '',
        [
          Validators.required,
          Validators.minLength(MIN_LENGTH),
          Validators.pattern(REGEX_PATTERNS.FORBIDDEN_CHARACTERS),
        ],
      ],
      categoryDescription: [
        '',
        [
          Validators.required,
          Validators.minLength(MIN_LENGTH),
          Validators.pattern(REGEX_PATTERNS.FORBIDDEN_CHARACTERS),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(page: number = 0, size: number = 5, sortBy: string = 'categoryName', isAscending: boolean = true): void {
    this.categoryService.getCategories(page, size, sortBy, isAscending).subscribe({
      next: (data) => {
        this.categories = data.content;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
        this.currentPage = data.currentPage;
      },
      error: (error) => {
        const message = ERROR_MESSAGES_BY_CODE[error.status as keyof typeof ERROR_MESSAGES_BY_CODE];
        this.toastService.showToast(message, ToastType.Error);
      },
    });
  }

  get categoryName() {
    return this.createCategoryForm.get('categoryName');
  }

  get categoryDescription() {
    return this.createCategoryForm.get('categoryDescription');
  }

  getErrorMessage(control: AbstractControl | null, fieldName: string): string {
    if (control?.touched && control?.errors) {
      const firstKey = Object.keys(
        control.errors
      )[0] as keyof typeof ERROR_MESSAGES;
      const error = control.errors[firstKey];
      return ERROR_MESSAGES[firstKey](fieldName, error);
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
      .subscribe({
        next: (response: HttpResponse<Category>) => {
          const message =
            response.status === HttpStatusCode.Created
              ? SUCCESS_MESSAGES.CATEGORY_CREATED
              : SUCCESS_MESSAGES.UNEXPECTED_RESPONSE;
          this.toastService.showToast(message, ToastType.Success);
          if (response.status === HttpStatusCode.Created) {
            this.createCategoryForm.reset({
              categoryName: '',
              categoryDescription: '',
            });
            this.loadCategories(); 
          }
        },
        error: (error) => {
          const message =
            ERROR_MESSAGES_BY_CODE[
              error.status as keyof typeof ERROR_MESSAGES_BY_CODE
            ] ;
          this.toastService.showToast(message, ToastType.Error);
        },
      });
  }

  get categoryNameError(): string {
    return this.getErrorMessage(this.categoryName, FIELD_NAMES.CATEGORY_NAME);
  }

  get categoryDescriptionError(): string {
    return this.getErrorMessage(
      this.categoryDescription,
      FIELD_NAMES.CATEGORY_DESCRIPTION
    );
  }

  isModalVisible: boolean = false;

  openModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
    this.createCategoryForm.reset({
      categoryName: '',
      categoryDescription: '',
    });
    this.createCategoryForm.markAsPristine();
    this.createCategoryForm.markAsUntouched();
  }

  confirmDelete() {
    this.closeModal();
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadCategories(this.currentPage, this.pageSize, this.sortBy, this.isAscending);
    }
  }

  changeSortOrder(sortBy: string): void {
    this.sortBy = sortBy;
    this.isAscending = !this.isAscending;
    this.loadCategories(this.currentPage, this.pageSize, this.sortBy, this.isAscending);
  }
}
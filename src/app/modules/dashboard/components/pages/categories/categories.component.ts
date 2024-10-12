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
const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_SORT_BY = 'categoryName';
const ELLIPSIS_THRESHOLD = 2;
const LAST_PAGE_THRESHOLD = 3;

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
  public currentPage: number = DEFAULT_PAGE;
  public isAscending: boolean = true;
  public sortBy: string = DEFAULT_SORT_BY;
  public pageSize: number = DEFAULT_PAGE_SIZE;

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

  loadCategories(
    page: number = DEFAULT_PAGE,
    size: number = DEFAULT_PAGE_SIZE,
    sortBy: string = DEFAULT_SORT_BY,
    isAscending: boolean = true
  ): void {
    this.categoryService
      .getCategories(page, size, sortBy, isAscending)
      .subscribe({
        next: (data) => {
          this.categories = data.content;
          this.totalElements = data.totalElements;
          this.totalPages = data.totalPages;
          this.currentPage = data.currentPage;
        },
        error: (error) => {
          const message =
            ERROR_MESSAGES_BY_CODE[
              error.status as keyof typeof ERROR_MESSAGES_BY_CODE
            ];
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
            ];
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
    if (page >= DEFAULT_PAGE && page < this.totalPages) {
      this.currentPage = page;
      this.loadCategories(
        this.currentPage,
        this.pageSize,
        this.sortBy,
        this.isAscending
      );
    }
  }

  changeSortOrder(sortBy: string): void {
    this.sortBy = sortBy;
    this.isAscending = !this.isAscending;
    this.loadCategories(
      this.currentPage,
      this.pageSize,
      this.sortBy,
      this.isAscending
    );
  }

  getPagesToShow(): number[] {
    const pages: number[] = [];
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;

    const addRange = (start: number, end: number) => {
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
    };

    const configurations = [
        {
            condition: totalPages <= 5,
            action: () => addRange(0, totalPages - 1)
        },
        {
            condition: currentPage <= 2,
            action: () => {
                addRange(0, 4);
                pages.push(-1, totalPages - 1);
            }
        },
        {
            condition: currentPage >= totalPages - 3,
            action: () => {
                pages.push(0, -1);
                addRange(totalPages - 5, totalPages - 1);
            }
        },
        {
            condition: true,
            action: () => {
                pages.push(0, -1);
                addRange(currentPage - 1, currentPage + 1);
                pages.push(-1, totalPages - 1);
            }
        }
    ];

    const config = configurations.find(config => config.condition);
    if (config) {
        config.action();
    }

    return pages;
}
  
  
  
  shouldShowEllipsis(): boolean {
    return this.currentPage + ELLIPSIS_THRESHOLD < this.totalPages - 1;
  }
  
  shouldShowLastPage(): boolean {
    return this.totalPages > 1 && this.currentPage + LAST_PAGE_THRESHOLD < this.totalPages;
  }
  

  onKeyDown(event: KeyboardEvent, sortField: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.changeSortOrder(sortField);
    }
  }

  onKeyDownButton(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openModal();
    }
  }
}
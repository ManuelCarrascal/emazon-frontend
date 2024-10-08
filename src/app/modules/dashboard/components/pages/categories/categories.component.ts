import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { ToastService, ToastType } from 'src/app/core/services/toast.service';
import { HttpResponse } from '@angular/common/http';
import { Category } from '../../../interfaces/category.interface';
import {
  ERROR_MESSAGES,
  ERROR_MESSAGES_BY_CODE,
  SUCCESS_MESSAGES,
  REGEX_PATTERNS,
  FIELD_NAMES,
  GENERIC_ERROR_MESSAGE,
} from 'src/app/shared/constants/categoriesComponent';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  public createCategoryForm: FormGroup;

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
          Validators.minLength(3),
          Validators.pattern(REGEX_PATTERNS.FORBIDDEN_CHARACTERS),
        ],
      ],
      categoryDescription: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(REGEX_PATTERNS.FORBIDDEN_CHARACTERS),
        ],
      ],
    });
  }

  ngOnInit(): void {
    // Initialize form
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
            response.status === 201
              ? SUCCESS_MESSAGES.CATEGORY_CREATED
              : SUCCESS_MESSAGES.UNEXPECTED_RESPONSE;
          this.toastService.showToast(message, ToastType.Success);
          if (response.status === 201) {
            this.createCategoryForm.reset({
              categoryName: '',
              categoryDescription: '',
            });
          }
        },
        error: (error) => {
          const message =
            ERROR_MESSAGES_BY_CODE[
              error.status as keyof typeof ERROR_MESSAGES_BY_CODE
            ] || GENERIC_ERROR_MESSAGE;
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
  }

  confirmDelete() {
    this.closeModal();
  }
}

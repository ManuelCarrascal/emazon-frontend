import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastService, ToastType } from '@/app/core/services/toast.service';
import { BrandService } from '../../../services/brand.service';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Brand } from '../../../interfaces/brand.interface';
import {
  ERROR_MESSAGES,
  ERROR_MESSAGES_BY_CODE,
  SUCCESS_MESSAGES,
  REGEX_PATTERNS,
  FIELD_NAMES,
} from '@/app/shared/constants/brandsComponent';

const MIN_LENGTH = 3;
const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_SORT_BY = 'brandName';

@Component({
  selector: 'app-brands-page',
  templateUrl: './brands-page.component.html',
  styleUrls: ['./brands-page.component.scss'],
})
export class BrandsPageComponent implements OnInit {
  public createBrandForm: FormGroup;
  public brands: Brand[] = [];
  public totalElements: number = 0;
  public totalPages: number = 0;
  public currentPage: number = DEFAULT_PAGE;
  public isAscending: boolean = true;
  public sortBy: string = DEFAULT_SORT_BY;
  public pageSize: number = DEFAULT_PAGE_SIZE;
  public isModalVisible: boolean = false;

  public tableColumns = [
    { key: 'brandName', label: 'Brand Name', sortable: true },
    { key: 'brandDescription', label: 'Brand Description', sortable: false },
  ];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly brandService: BrandService,
    private readonly toastService: ToastService
  ) {
    this.createBrandForm = this.formBuilder.group({
      brandName: [
        '',
        [
          Validators.required,
          Validators.minLength(MIN_LENGTH),
          Validators.maxLength(50),
          Validators.pattern(REGEX_PATTERNS.FORBIDDEN_CHARACTERS),
        ],
      ],
      brandDescription: [
        '',
        [
          Validators.required,
          Validators.minLength(MIN_LENGTH),
          Validators.maxLength(120),
          Validators.pattern(REGEX_PATTERNS.FORBIDDEN_CHARACTERS),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.loadBrands();
  }

  // Form related methods
  get brandName() {
    return this.createBrandForm.get('brandName');
  }

  get brandDescription() {
    return this.createBrandForm.get('brandDescription');
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

  get brandNameError(): string {
    return this.getErrorMessage(this.brandName, FIELD_NAMES.BRAND_NAME);
  }

  get brandDescriptionError(): string {
    return this.getErrorMessage(
      this.brandDescription,
      FIELD_NAMES.BRAND_DESCRIPTION
    );
  }

  createBrand(): void {
    if (this.createBrandForm.invalid) {
      this.createBrandForm.markAllAsTouched();
      return;
    }

    this.brandService.createBrand(this.createBrandForm.value).subscribe({
      next: (response: HttpResponse<Brand>) => {
        const message =
          response.status === HttpStatusCode.Created
            ? SUCCESS_MESSAGES.BRAND_CREATED
            : SUCCESS_MESSAGES.UNEXPECTED_RESPONSE;
        this.toastService.showToast(message, ToastType.Success);
        if (response.status === HttpStatusCode.Created) {
          this.createBrandForm.reset({
            brandName: '',
            brandDescription: '',
          });
          this.loadBrands();
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

  loadBrands(
    page: number = DEFAULT_PAGE,
    size: number = DEFAULT_PAGE_SIZE,
    sortBy: string = DEFAULT_SORT_BY,
    isAscending: boolean = true
  ): void {
    this.brandService.getBrands(page, size, sortBy, isAscending).subscribe({
      next: (data) => {
        this.brands = data.content;
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

  changePage(page: number): void {
    if (page >= DEFAULT_PAGE && page < this.totalPages) {
      this.currentPage = page;
      this.loadBrands(
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
    this.loadBrands(
      this.currentPage,
      this.pageSize,
      this.sortBy,
      this.isAscending
    );
  }

  onSortChange(sortField: string): void {
    if (
      this.tableColumns.find((column) => column.key === sortField)?.sortable
    ) {
      this.sortBy = sortField;
      this.isAscending = !this.isAscending;
      this.loadBrands(
        this.currentPage,
        this.pageSize,
        this.sortBy,
        this.isAscending
      );
    }
  }

  openModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
    this.createBrandForm.reset({
      brandName: '',
      brandDescription: '',
    });
    this.createBrandForm.markAsPristine();
    this.createBrandForm.markAsUntouched();
  }

  confirmDelete() {
    this.closeModal();
  }

  onKeyDownButton(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openModal();
    }
  }
}

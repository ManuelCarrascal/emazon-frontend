import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category/category.service';
import { CategoryResponse } from '../../../interfaces/category.interface';
import { ERROR_MESSAGES, FIELD_NAMES, REGEX_PATTERNS } from '@/app/shared/constants/productsComponent';
import { categoriesCountValidator } from '@/app/shared/validators/categories-count-validator';

const MIN_LENGTH = 3;
const MAX_CATEGORIES = 3;

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss'],
})
export class ProductsPageComponent implements OnInit {
  public isModalVisible: boolean = false;
  public createProductForm: FormGroup;
  public categories: CategoryResponse[] = [];
  public filteredCategories: CategoryResponse[] = [];
  public selectedCategories: CategoryResponse[] = [];
  public searchTerm: string = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly categoryService: CategoryService
  ) {
    this.createProductForm = this.formBuilder.group({
      productName: [
        '',
        [
          Validators.required,
          Validators.minLength(MIN_LENGTH),
          Validators.pattern(REGEX_PATTERNS.FORBIDDEN_CHARACTERS),
        ],
      ],
      productDescription: [
        '',
        [
          Validators.required,
          Validators.minLength(MIN_LENGTH),
          Validators.maxLength(90),
          Validators.pattern(REGEX_PATTERNS.FORBIDDEN_CHARACTERS),
        ],
      ],
      categoriesId: [[], [Validators.required, categoriesCountValidator(1, MAX_CATEGORIES)]],
      searchTerm: [''],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  
    this.createProductForm.get('searchTerm')?.valueChanges.subscribe(() => {
      this.filterCategories();
    });
  }
  
  openModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
    this.createProductForm.reset({
      productName: '',
      productDescription: '',
    });
    this.createProductForm.markAsPristine();
    this.createProductForm.markAsUntouched();
    this.selectedCategories = [];
    this.createProductForm.get('searchTerm')?.enable(); 
  }

  onKeyDownButton(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openModal();
    }
  }

  get productName() {
    return this.createProductForm.get('productName');
  }

  get productDescription() {
    return this.createProductForm.get('productDescription');
  }

  get productNameError(): string {
    return this.getErrorMessage(this.productName, FIELD_NAMES.PRODUCT_NAME);
  }

  get productDescriptionError(): string {
    return this.getErrorMessage(this.productDescription, FIELD_NAMES.PRODUCT_DESCRIPTION);
  }

  getErrorMessage(control: AbstractControl | null, fieldName: string): string {
    if (control?.touched && control?.errors) {
      const firstKey = Object.keys(control.errors)[0] as keyof typeof ERROR_MESSAGES;
      const error = control.errors[firstKey];
      return ERROR_MESSAGES[firstKey](fieldName, error);
    }
    return '';
  }

  createProduct(): void {
    if (this.createProductForm.invalid) {
      return;
    }
    console.log('Product created');
    this.closeModal();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        console.log('Loaded Categories:', this.categories); 
      },
      error: (error) => {
        console.error('Error loading categories', error);
      },
    });
  }

  filterCategories(): void {
    const searchValue = this.createProductForm.get('searchTerm')?.value.trim();
    
    if (searchValue) {
      console.log('Search Term:', searchValue); 
      this.filteredCategories = this.categories.filter(category =>
        category.categoryName.toLowerCase().includes(searchValue.toLowerCase())
      );
      console.log('Filtered Categories:', this.filteredCategories); 
    } else {
      this.filteredCategories = [];
    }
  }

  selectCategory(category: CategoryResponse): void {
    if (this.selectedCategories.length >= MAX_CATEGORIES) {
      return;
    }
    if (!this.selectedCategories.includes(category)) {
      this.selectedCategories.push(category);
      this.createProductForm.get('categoriesId')?.setValue(this.selectedCategories);
      this.createProductForm.get('searchTerm')?.setValue('');
      this.filteredCategories = [];
      if (this.selectedCategories.length >= MAX_CATEGORIES) {
        this.createProductForm.get('searchTerm')?.disable();
      }
    }
  }

  removeCategory(category: CategoryResponse): void {
    this.selectedCategories = this.selectedCategories.filter(cat => cat !== category);
    this.createProductForm.get('categoriesId')?.setValue(this.selectedCategories);
    if (this.selectedCategories.length < MAX_CATEGORIES) {
      this.createProductForm.get('searchTerm')?.enable(); 
    }
  }
}
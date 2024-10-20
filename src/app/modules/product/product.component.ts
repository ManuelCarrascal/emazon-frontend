import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ERROR_MESSAGES, FIELD_NAMES, REGEX_PATTERNS } from '@/app/shared/constants/productsComponent';
import { categoriesCountValidator } from '@/app/shared/validators/categories-count-validator';
import { CategoryResponse } from '../dashboard/interfaces/category.interface';
import { BrandResponse } from '../dashboard/interfaces/brand.interface';
import { CategoryService } from '../dashboard/services/category/category.service';
import { BrandService } from '../dashboard/services/brand/brand.service';
import { ProductService } from '../dashboard/services/product/product.service';
import { ToastService, ToastType } from '@/app/shared/services/toast.service';

const MIN_LENGTH = 3;
const MAX_CATEGORIES = 3;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  public isModalVisible: boolean = false;
  public createProductForm: FormGroup;
  public categories: CategoryResponse[] = [];
  public filteredCategories: CategoryResponse[] = [];
  public selectedCategories: CategoryResponse[] = [];
  public brands: BrandResponse[] = [];
  public filteredBrands: BrandResponse[] = [];
  public selectedBrand: BrandResponse | null = null;
  public dropdownState: { [key: string]: { searchTerm: string, active: boolean } };

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
    private readonly productService: ProductService,
    private readonly toastService: ToastService,
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
      productQuantity: [
        '',
        [
          Validators.required,
          Validators.min(1),
        ],
      ],
      productPrice: [
        '',
        [
          Validators.required,
          Validators.min(0.0),
        ],
      ],
      brandId: [null, [Validators.required]],
      categoryIds: [[], [Validators.required, categoriesCountValidator(1, MAX_CATEGORIES)]],
    });

    this.dropdownState = {
      brand: { searchTerm: '', active: false },
      category: { searchTerm: '', active: false },
    };
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadBrands();
  }
  
  openModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
    this.createProductForm.reset({
      productName: '',
      productDescription: '',
      productQuantity: '',
      productPrice: '',
      brandId: null,
      categoryIds: [],
    });
    this.createProductForm.markAsPristine();
    this.createProductForm.markAsUntouched();
    this.selectedCategories = [];
    this.selectedBrand = null;
    this.dropdownState = {
      brand: { searchTerm: '', active: false },
      category: { searchTerm: '', active: false },
    };
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

  get productQuantity() {
    return this.createProductForm.get('productQuantity');
  }

  get productPrice() {
    return this.createProductForm.get('productPrice');
  }

  get brandId() {
    return this.createProductForm.get('brandId');
  }

  get productNameError(): string {
    return this.getErrorMessage(this.productName, FIELD_NAMES.PRODUCT_NAME);
  }

  get productDescriptionError(): string {
    return this.getErrorMessage(this.productDescription, FIELD_NAMES.PRODUCT_DESCRIPTION);
  }

  get productQuantityError(): string {
    return this.getErrorMessage(this.productQuantity, FIELD_NAMES.PRODUCT_QUANTITY);
  }

  get productPriceError(): string {
    return this.getErrorMessage(this.productPrice, FIELD_NAMES.PRODUCT_PRICE);
  }

  get brandIdError(): string {
    return this.getErrorMessage(this.brandId, FIELD_NAMES.BRAND_ID);
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
      this.createProductForm.markAllAsTouched();
      return;
    }
    const productData = this.createProductForm.value;
    if (productData.categoryIds.length === 0) {
      return;
    }
    this.productService.createProduct(productData).subscribe({
      next: (product) => {
        this.toastService.showToast('Product created successfully', ToastType.Success);
      },
      error: (error) => {
        this.toastService.showToast('Error creating product', ToastType.Error);
      },
    });
    this.closeModal();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        this.toastService.showToast('Error loading categories', ToastType.Error);
      },
    });
  }

  loadBrands(): void {
    this.brandService.getAllBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
      },
      error: (error) => {
        this.toastService.showToast('Error loading brands', ToastType.Error);
      },
    });
  }

  filterCategories(): void {
    const searchValue = this.dropdownState['category'].searchTerm.trim();
    
    if (searchValue) {
      this.filteredCategories = this.categories.filter(category =>
        category.categoryName.toLowerCase().includes(searchValue.toLowerCase())
      );
    } else {
      this.filteredCategories = [];
    }
  }

  filterBrands(): void {
    const searchValue = this.dropdownState['brand'].searchTerm.trim();
    
    if (searchValue) {
      this.filteredBrands = this.brands.filter(brand =>
        brand.brandName.toLowerCase().includes(searchValue.toLowerCase())
      );
    } else {
      this.filteredBrands = [];
    }
  }

  onSearchTermChange(dropdown: string, searchTerm: string): void {
    this.dropdownState[dropdown].searchTerm = searchTerm;
    if (dropdown === 'category') {
      this.filterCategories();
    } else if (dropdown === 'brand') {
      this.filterBrands();
    }
    this.setActiveDropdown(dropdown);
  }

  selectCategory(category: CategoryResponse): void {
    if (this.selectedCategories.length >= MAX_CATEGORIES) {
      return;
    }
    if (!this.selectedCategories.includes(category)) {
      this.selectedCategories.push(category);
      this.createProductForm.get('categoryIds')?.setValue(this.selectedCategories.map(cat => cat.categoryId));
      this.dropdownState['category'].searchTerm = '';
      this.filteredCategories = [];
      if (this.selectedCategories.length >= MAX_CATEGORIES) {
        this.dropdownState['category'].active = false;
      }
    }
  }

  removeCategory(category: CategoryResponse): void {
    this.selectedCategories = this.selectedCategories.filter(cat => cat !== category);
    this.createProductForm.get('categoryIds')?.setValue(this.selectedCategories.map(cat => cat.categoryId));
    if (this.selectedCategories.length < MAX_CATEGORIES) {
      this.dropdownState['category'].active = true; 
    }
  }

  selectBrand(brand: BrandResponse): void {
    this.selectedBrand = brand;
    this.createProductForm.get('brandId')?.setValue(brand.brandId);
    this.dropdownState['brand'].searchTerm = '';
    this.filteredBrands = [];
  }

  setActiveDropdown(dropdown: string): void {
    for (const key in this.dropdownState) {
      this.dropdownState[key].active = key === dropdown;
    }
  }
}
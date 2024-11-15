import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  CATEGORY_NAMES,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_BY,
  ERROR_ADDING_PRODUCT_TO_CART,
  ERROR_CREATING_PRODUCT,
  ERROR_FETCHING_NEXT_SUPPLY_DATE,
  ERROR_LOADING_BRANDS,
  ERROR_LOADING_CATEGORIES,
  ERROR_LOADING_PRODUCTS,
  ERROR_MESSAGES,
  ERROR_UPDATING_PRODUCT_QUANTITY,
  FIELD_NAMES,
  MAX_CATEGORIES,
  MIN_LENGTH,
  NUMBER_OF_CATEGORIES,
  REGEX_PATTERNS,
  SUCCESS_ADDING_PRODUCT_TO_CART,
  SUCCESS_PRODUCT_CREATED,
  SUCCESS_UPDATING_PRODUCT_QUANTITY,
} from '@/app/shared/constants/productsComponent';
import { categoriesCountValidator } from '@/app/shared/validators/categories-count-validator';
import { CategoryService } from '@/app/shared/services/category/category.service';
import { BrandService } from '@/app/shared/services/brand/brand.service';
import { ProductService } from '@/app/shared/services/product/product.service';
import {
  ToastService,
  ToastType,
} from '@/app/shared/services/toast/toast.service';
import { CategoryResponse } from '@/app/shared/interfaces/category.interface';
import { BrandResponse } from '@/app/shared/interfaces/brand.interface';
import {
  ProductResponse,
  ProductView,
} from '@/app/shared/interfaces/product.interface';
import { SupplyService } from '@/app/shared/services/supply/supply.service';
import {
  SupplyRequest,
  NextSupplyResponse,
} from '@/app/shared/interfaces/supply.interface';
import { CartService } from '@/app/shared/services/cart/cart.service';
import { ROLES } from '@/app/shared/constants/roles.constants';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  public readonly ROLES = ROLES;
  public isModalVisible: boolean = false;
  public isIncrementModalVisible: boolean = false;
  public isAddToCartModalVisible: boolean = false;
  public createProductForm: FormGroup;
  public incrementForm: FormGroup;
  public addToCartForm: FormGroup;
  public categories: CategoryResponse[] = [];
  public filteredCategories: CategoryResponse[] = [];
  public selectedCategories: CategoryResponse[] = [];
  public brands: BrandResponse[] = [];
  public filteredBrands: BrandResponse[] = [];
  public selectedBrand: BrandResponse | null = null;
  size: number = 5;
  public dropdownState: {
    [key: string]: { searchTerm: string; active: boolean };
  };

  public products: ProductView[] = [];
  public totalElements: number = 0;
  public totalPages: number = 0;
  public currentPage: number = DEFAULT_PAGE;
  public isAscending: boolean = true;
  public sortBy: string = DEFAULT_SORT_BY;
  public pageSize: number = DEFAULT_PAGE_SIZE;
  public tableColumns = [
    { key: 'productName', label: 'Product Name', sortable: true },
    {
      key: 'productDescription',
      label: 'Product Description',
      sortable: false,
    },
    { key: 'productQuantity', label: 'Product Quantity', sortable: false },
    { key: 'productPrice', label: 'Product Price', sortable: false },
    { key: 'brandName', label: 'Brand Name', sortable: true },
    { key: 'categoryNames', label: 'Categories', sortable: true },
  ];

  public selectedProduct: ProductView | null = null;
  public nextSupplyDateString: string | null = null;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
    private readonly productService: ProductService,
    private readonly toastService: ToastService,
    private readonly supplyService: SupplyService,
    private readonly cartService: CartService
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
      productQuantity: ['', [Validators.required, Validators.min(1)]],
      productPrice: ['', [Validators.required, Validators.min(0.0)]],
      brandId: [null, [Validators.required]],
      categoryIds: [
        [],
        [Validators.required, categoriesCountValidator(1, MAX_CATEGORIES)],
      ],
    });

    this.incrementForm = this.formBuilder.group({
      incrementAmount: ['', [Validators.required, Validators.min(1)]],
      nextSupplyDate: ['', [Validators.required]],
    });

    this.addToCartForm = this.formBuilder.group({
      quantity: ['', [Validators.required, Validators.min(1)]],
    });

    this.dropdownState = {
      brand: { searchTerm: '', active: false },
      category: { searchTerm: '', active: false },
    };
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadBrands();
    this.loadProducts();
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

  openIncrementModal(product: ProductView) {
    this.selectedProduct = product;
    this.isIncrementModalVisible = true;
  }

  closeIncrementModal() {
    this.isIncrementModalVisible = false;
    this.incrementForm.reset({
      incrementAmount: '',
    });
    this.incrementForm.markAsPristine();
    this.incrementForm.markAsUntouched();
  }

  openAddToCartModal(product: ProductView) {
    this.selectedProduct = product;
    this.isAddToCartModalVisible = true;
    if (this.selectedProduct.productQuantity === 0) {
      this.loadNextSupplyDate(this.selectedProduct.productId);
    }
  }

  closeAddToCartModal() {
    this.isAddToCartModalVisible = false;
    this.addToCartForm.reset({
      quantity: '',
    });
    this.addToCartForm.markAsPristine();
    this.addToCartForm.markAsUntouched();
    this.nextSupplyDateString = null;
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

  get incrementAmount() {
    return this.incrementForm.get('incrementAmount');
  }

  get quantity() {
    return this.addToCartForm.get('quantity');
  }

  get productNameError(): string {
    return this.getErrorMessage(this.productName, FIELD_NAMES.PRODUCT_NAME);
  }

  get productDescriptionError(): string {
    return this.getErrorMessage(
      this.productDescription,
      FIELD_NAMES.PRODUCT_DESCRIPTION
    );
  }

  get productQuantityError(): string {
    return this.getErrorMessage(
      this.productQuantity,
      FIELD_NAMES.PRODUCT_QUANTITY
    );
  }

  get productPriceError(): string {
    return this.getErrorMessage(this.productPrice, FIELD_NAMES.PRODUCT_PRICE);
  }

  get brandIdError(): string {
    return this.getErrorMessage(this.brandId, FIELD_NAMES.BRAND_ID);
  }

  get incrementAmountError(): string {
    return this.getErrorMessage(this.incrementAmount, 'Increment Amount');
  }

  get quantityError(): string {
    return this.getErrorMessage(this.quantity, 'Quantity');
  }

  get nextSupplyDate() {
    return this.incrementForm.get('nextSupplyDate');
  }

  get nextSupplyDateError(): string {
    return this.getErrorMessage(this.nextSupplyDate, 'Next Supply Date');
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
      next: () => {
        this.toastService.showToast(SUCCESS_PRODUCT_CREATED, ToastType.Success);
        this.loadProducts();
        this.closeModal();
      },
      error: () => {
        this.toastService.showToast(ERROR_CREATING_PRODUCT, ToastType.Error);
      },
    });
  }

  incrementQuantity(): void {
    if (this.incrementForm.invalid || !this.selectedProduct) {
      this.incrementForm.markAllAsTouched();
      return;
    }
    const incrementAmount = this.incrementForm.value.incrementAmount;
    const nextSupplyDate = this.incrementForm.value.nextSupplyDate;
    const supplyRequest: SupplyRequest = {
      productQuantity: incrementAmount,
      nextSupplyDate: nextSupplyDate,
    };

    this.supplyService
      .addSupply(this.selectedProduct.productId, supplyRequest)
      .subscribe({
        next: () => {
          this.toastService.showToast(
            SUCCESS_UPDATING_PRODUCT_QUANTITY,
            ToastType.Success
          );
          this.loadProducts();
          this.closeIncrementModal();
        },
        error: () => {
          this.toastService.showToast(
            ERROR_UPDATING_PRODUCT_QUANTITY,
            ToastType.Error
          );
        },
      });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: () => {
        this.toastService.showToast(ERROR_LOADING_CATEGORIES, ToastType.Error);
      },
    });
  }

  loadBrands(): void {
    this.brandService.getAllBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
      },
      error: () => {
        this.toastService.showToast(ERROR_LOADING_BRANDS, ToastType.Error);
      },
    });
  }

  loadProducts(
    page: number = DEFAULT_PAGE,
    size: number = DEFAULT_PAGE_SIZE,
    sortBy: string = DEFAULT_SORT_BY,
    isAscending: boolean = true
  ): void {
    this.productService.getProducts(page, size, sortBy, isAscending).subscribe({
      next: (data) => {
        this.products = data.content.map((productResponse) =>
          this.transformProductResponse(productResponse)
        );
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
        this.currentPage = data.currentPage;
      },
      error: () => {
        this.toastService.showToast(ERROR_LOADING_PRODUCTS, ToastType.Error);
      },
    });
  }

  transformProductResponse(productResponse: ProductResponse): ProductView {
    return {
      productId: productResponse.productId,
      productName: productResponse.productName,
      productDescription: productResponse.productDescription,
      productQuantity: productResponse.productQuantity,
      productPrice: productResponse.productPrice,
      productCategories: productResponse.categories.map(
        (category) => category.categoryId
      ),
      brandName: productResponse.brand.brandName,
      categoryIds: productResponse.categories.map(
        (category) => category.categoryId
      ),
      categoryNames: productResponse.categories
        .map((category) => category.categoryName)
        .join(', '),
    };
  }

  changePage(page: number): void {
    if (page >= DEFAULT_PAGE && page < this.totalPages) {
      this.currentPage = page;
      this.loadProducts(
        this.currentPage,
        this.pageSize,
        this.sortBy,
        this.isAscending
      );
    }
  }

  changeSortOrder(sortBy: string): void {
    this.sortBy = sortBy === CATEGORY_NAMES ? NUMBER_OF_CATEGORIES : sortBy;
    this.isAscending = !this.isAscending;
    this.loadProducts(
      this.currentPage,
      this.pageSize,
      this.sortBy,
      this.isAscending
    );
  }

  onSortChange(event: { sortBy: string; isAscending: boolean }): void {
    this.sortBy =
      event.sortBy === CATEGORY_NAMES ? NUMBER_OF_CATEGORIES : event.sortBy;
    this.isAscending = event.isAscending;
    this.loadProducts(
      this.currentPage,
      this.pageSize,
      this.sortBy,
      this.isAscending
    );
  }

  onRowsPerPageChange(rowsPerPage: number): void {
    this.pageSize = rowsPerPage;
    this.loadProducts(
      this.currentPage,
      this.pageSize,
      this.sortBy,
      this.isAscending
    );
  }

  filterCategories(): void {
    const searchValue = this.dropdownState['category'].searchTerm.trim();

    if (searchValue) {
      this.filteredCategories = this.categories.filter((category) =>
        category.categoryName.toLowerCase().includes(searchValue.toLowerCase())
      );
    } else {
      this.filteredCategories = [];
    }
  }

  filterBrands(): void {
    const searchValue = this.dropdownState['brand'].searchTerm.trim();

    if (searchValue) {
      this.filteredBrands = this.brands.filter((brand) =>
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
      this.createProductForm
        .get('categoryIds')
        ?.setValue(this.selectedCategories.map((cat) => cat.categoryId));
      this.dropdownState['category'].searchTerm = '';
      this.filteredCategories = [];
      if (this.selectedCategories.length >= MAX_CATEGORIES) {
        this.dropdownState['category'].active = false;
      }
    }
  }

  removeCategory(category: CategoryResponse): void {
    this.selectedCategories = this.selectedCategories.filter(
      (cat) => cat !== category
    );
    this.createProductForm
      .get('categoryIds')
      ?.setValue(this.selectedCategories.map((cat) => cat.categoryId));
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

  addToCart(): void {
    if (this.addToCartForm.invalid || !this.selectedProduct) {
      this.addToCartForm.markAllAsTouched();
      return;
    }
    const quantity = this.addToCartForm.value.quantity;
    this.cartService
      .addProductToCart(this.selectedProduct.productId, quantity)
      .subscribe({
        next: () => {
          this.toastService.showToast(
            SUCCESS_ADDING_PRODUCT_TO_CART,
            ToastType.Success
          );
          this.closeAddToCartModal();
        },
        error: () => {
          this.toastService.showToast(
            ERROR_ADDING_PRODUCT_TO_CART,
            ToastType.Error
          );
        },
      });
  }

  loadNextSupplyDate(productId: number): void {
    this.supplyService.getNextSupplyDate(productId).subscribe({
      next: (response: NextSupplyResponse) => {
        this.nextSupplyDateString = response.nextSupplyDate;
      },
      error: () => {
        this.toastService.showToast(
          ERROR_FETCHING_NEXT_SUPPLY_DATE,
          ToastType.Error
        );
      },
    });
  }
}

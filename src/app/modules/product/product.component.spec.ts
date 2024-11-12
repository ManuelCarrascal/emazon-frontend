import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ProductComponent } from './product.component';
import { CategoryService } from '@/app/shared/services/category/category.service';
import { BrandService } from '@/app/shared/services/brand/brand.service';
import { ProductService } from '@/app/shared/services/product/product.service';
import {
  ToastService,
  ToastType,
} from '@/app/shared/services/toast/toast.service';
import { SupplyService } from '@/app/shared/services/supply/supply.service';
import { InputWithErrorComponent } from '@/app/ui/molecules/input-with-error/input-with-error.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TextAreaWithErrorComponent } from '@/app/ui/molecules/text-area-with-error/text-area-with-error.component';
import { DropdownSearchInputComponent } from '@/app/ui/molecules/dropdown-search-input/dropdown-search-input.component';
import { BrandResponse } from '@/app/shared/interfaces/brand.interface';
import { CategoryResponse } from '@/app/shared/interfaces/category.interface';
import { ProductView } from '@/app/shared/interfaces/product.interface';
import { CartService } from '@/app/shared/services/cart/cart.service';

const mockCategoryService = {
  getAllCategories: jest.fn().mockReturnValue(of([])),
};
const mockBrandService = {
  getAllBrands: jest.fn().mockReturnValue(of([])),
};
const mockProductService = {
  createProduct: jest.fn(),
  getProducts: jest
    .fn()
    .mockReturnValue(
      of({ content: [], totalElements: 0, totalPages: 0, currentPage: 0 })
    ),
};
const mockToastService = {
  showToast: jest.fn(),
};
const mockSupplyService = {
  addSupply: jest.fn(),
  getNextSupplyDate: jest.fn(),
};

const mockCartService = {
  addProductToCart: jest.fn(),
};

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProductComponent,
        InputWithErrorComponent,
        TextAreaWithErrorComponent,
        DropdownSearchInputComponent,
      ],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: BrandService, useValue: mockBrandService },
        { provide: ProductService, useValue: mockProductService },
        { provide: ToastService, useValue: mockToastService },
        { provide: SupplyService, useValue: mockSupplyService },
        { provide: CartService, useValue: mockCartService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    component.createProductForm = new FormBuilder().group({
      productName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[a-zA-Z0-9 ]+$/),
        ],
      ],
      productDescription: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(90),
          Validators.pattern(/^[a-zA-Z0-9 ]+$/),
        ],
      ],
      productQuantity: [0, [Validators.required, Validators.min(1)]],
      productPrice: [0, [Validators.required, Validators.min(0)]],
      brandId: [null, Validators.required],
      categoryIds: [
        [],
        [Validators.required, Validators.minLength(1), Validators.maxLength(3)],
      ],
    });
    component.incrementForm = new FormBuilder().group({
      incrementAmount: [0, [Validators.required, Validators.min(1)]],
      nextSupplyDate: ['', Validators.required],
    });
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms and load categories, brands, and products on init', () => {
    jest.spyOn(component, 'loadCategories');
    jest.spyOn(component, 'loadBrands');
    jest.spyOn(component, 'loadProducts');

    component.ngOnInit();

    expect(component.loadCategories).toHaveBeenCalled();
    expect(component.loadBrands).toHaveBeenCalled();
    expect(component.loadProducts).toHaveBeenCalled();
  });

  it('should show an error toast if loading categories fails', () => {
    mockCategoryService.getAllCategories.mockReturnValueOnce(
      throwError(() => new Error('Error'))
    );
    component.loadCategories();
    expect(mockToastService.showToast).toHaveBeenCalledWith(
      'Error loading categories',
      ToastType.Error
    );
  });

  it('should show an error toast if loading brands fails', () => {
    mockBrandService.getAllBrands.mockReturnValueOnce(
      throwError(() => new Error('Error'))
    );
    component.loadBrands();
    expect(mockToastService.showToast).toHaveBeenCalledWith(
      'Error loading brands',
      ToastType.Error
    );
  });

  it('should validate the createProductForm and not call service if invalid', () => {
    component.createProductForm.patchValue({
      productName: '',
      productDescription: '',
      productQuantity: 0,
      productPrice: -1,
      brandId: null,
      categoryIds: [],
    });
    component.createProduct();
    expect(component.createProductForm.invalid).toBe(true);
    expect(mockProductService.createProduct).not.toHaveBeenCalled();
  });

  it('should call ProductService to create a product if form is valid', () => {
    component.createProductForm.patchValue({
      productName: 'Valid Product',
      productDescription: 'Valid Description',
      productQuantity: 10,
      productPrice: 100,
      brandId: 1,
      categoryIds: [1, 2],
    });
    component.createProductForm.markAllAsTouched();
    component.createProductForm.updateValueAndValidity();
    fixture.detectChanges();
    mockProductService.createProduct.mockReturnValue(of({}));

    component.createProduct();

    expect(mockToastService.showToast).toHaveBeenCalledWith(
      'Product created successfully',
      ToastType.Success
    );
  });

  it('should show an error toast if creating product fails', () => {
    component.createProductForm.patchValue({
      productName: 'Valid Product',
      productDescription: 'Valid Description',
      productQuantity: 10,
      productPrice: 100,
      brandId: 1,
      categoryIds: [1, 2],
    });
    mockProductService.createProduct.mockReturnValue(
      throwError(() => new Error('Error'))
    );

    component.createProduct();

    expect(mockToastService.showToast).toHaveBeenCalledWith(
      'Error creating product',
      ToastType.Error
    );
  });

  it('should reset the form and close the modal when closing the modal', () => {
    component.createProductForm.patchValue({
      productName: 'Valid Product',
      productDescription: 'Valid Description',
    });
    component.closeModal();

    expect(component.createProductForm.pristine).toBe(true);
    expect(component.createProductForm.untouched).toBe(true);
    expect(component.isModalVisible).toBe(false);
  });

  it('should open and close the increment modal', () => {
    const product = { productId: 1, productName: 'Product 1' } as ProductView;
    component.openIncrementModal(product);
    expect(component.isIncrementModalVisible).toBe(true);
    expect(component.selectedProduct).toBe(product);

    component.closeIncrementModal();
    expect(component.isIncrementModalVisible).toBe(false);
    expect(component.incrementForm.pristine).toBe(true);
    expect(component.incrementForm.untouched).toBe(true);
  });

  it('should increment product quantity and show success toast', () => {
    const product = { productId: 1, productName: 'Product 1' } as ProductView;
    component.selectedProduct = product;
    component.incrementForm.patchValue({
      incrementAmount: 10,
      nextSupplyDate: '2023-01-01',
    });
    mockSupplyService.addSupply.mockReturnValue(of({}));

    component.incrementQuantity();

    expect(mockSupplyService.addSupply).toHaveBeenCalledWith(
      product.productId,
      {
        productQuantity: 10,
        nextSupplyDate: '2023-01-01',
      }
    );
    expect(mockToastService.showToast).toHaveBeenCalledWith(
      'Product quantity updated successfully',
      ToastType.Success
    );
  });

  it('should show an error toast if incrementing product quantity fails', () => {
    const product = { productId: 1, productName: 'Product 1' } as ProductView;
    component.selectedProduct = product;
    component.incrementForm.patchValue({
      incrementAmount: 10,
      nextSupplyDate: '2023-01-01',
    });
    mockSupplyService.addSupply.mockReturnValue(
      throwError(() => new Error('Error'))
    );

    component.incrementQuantity();

    expect(mockToastService.showToast).toHaveBeenCalledWith(
      'Error updating product quantity',
      ToastType.Error
    );
  });

  it('should filter categories based on search term', () => {
    component.categories = [
      { categoryId: 1, categoryName: 'Category 1' },
      { categoryId: 2, categoryName: 'Category 2' },
    ] as CategoryResponse[];
    component.dropdownState['category'].searchTerm = 'Category 1';

    component.filterCategories();

    expect(component.filteredCategories).toEqual([
      { categoryId: 1, categoryName: 'Category 1' },
    ]);
  });

  it('should filter brands based on search term', () => {
    component.brands = [
      { brandId: 1, brandName: 'Brand 1' },
      { brandId: 2, brandName: 'Brand 2' },
    ] as BrandResponse[];
    component.dropdownState['brand'].searchTerm = 'Brand 1';

    component.filterBrands();

    expect(component.filteredBrands).toEqual([
      { brandId: 1, brandName: 'Brand 1' },
    ]);
  });

  it('should handle search term change for categories', () => {
    jest.spyOn(component, 'filterCategories');
    component.onSearchTermChange('category', 'Category 1');
    expect(component.dropdownState['category'].searchTerm).toBe('Category 1');
    expect(component.filterCategories).toHaveBeenCalled();
  });

  it('should handle search term change for brands', () => {
    jest.spyOn(component, 'filterBrands');
    component.onSearchTermChange('brand', 'Brand 1');
    expect(component.dropdownState['brand'].searchTerm).toBe('Brand 1');
    expect(component.filterBrands).toHaveBeenCalled();
  });

  it('should select a category', () => {
    const category = {
      categoryId: 1,
      categoryName: 'Category 1',
    } as CategoryResponse;
    component.selectCategory(category);
    expect(component.selectedCategories).toContain(category);
    expect(component.createProductForm.get('categoryIds')?.value).toContain(
      category.categoryId
    );
  });

  it('should remove a category', () => {
    const category = {
      categoryId: 1,
      categoryName: 'Category 1',
    } as CategoryResponse;
    component.selectedCategories = [category];
    component.removeCategory(category);
    expect(component.selectedCategories).not.toContain(category);
    expect(component.createProductForm.get('categoryIds')?.value).not.toContain(
      category.categoryId
    );
  });

  it('should select a brand', () => {
    const brand = { brandId: 1, brandName: 'Brand 1' } as BrandResponse;
    component.selectBrand(brand);
    expect(component.selectedBrand).toBe(brand);
    expect(component.createProductForm.get('brandId')?.value).toBe(
      brand.brandId
    );
  });

  it('should set active dropdown', () => {
    component.setActiveDropdown('brand');
    expect(component.dropdownState['brand'].active).toBe(true);
    expect(component.dropdownState['category'].active).toBe(false);
  });

  it('should change rows per page and load products', () => {
    jest.spyOn(component, 'loadProducts');
    component.onRowsPerPageChange(10);
    expect(component.pageSize).toBe(10);
    expect(component.loadProducts).toHaveBeenCalledWith(
      component.currentPage,
      10,
      component.sortBy,
      component.isAscending
    );
  });

  it('should change sort order and load products', () => {
    jest.spyOn(component, 'loadProducts');
    component.changeSortOrder('productName');
    expect(component.sortBy).toBe('productName');
    expect(component.isAscending).toBe(false);
    expect(component.loadProducts).toHaveBeenCalledWith(
      component.currentPage,
      component.pageSize,
      'productName',
      false
    );
  });

  it('should open modal on key down button event', () => {
    jest.spyOn(component, 'openModal');
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    component.onKeyDownButton(event);
    expect(component.openModal).toHaveBeenCalled();
  });

  it('should open add to cart modal', () => {
    const product = { productId: 1 } as ProductView;
    component.openAddToCartModal(product);
    expect(component.selectedProduct).toBe(product);
    expect(component.isAddToCartModalVisible).toBe(true);
  });

  it('should close add to cart modal', () => {
    component.closeAddToCartModal();
    expect(component.isAddToCartModalVisible).toBe(false);
    expect(component.addToCartForm.pristine).toBe(true);
    expect(component.addToCartForm.untouched).toBe(true);
    expect(component.addToCartForm.value).toEqual({ quantity: '' });
  });

  it('should add product to cart', () => {
    const productId = 3;
    const quantity = 5;
    const selectedProduct = { productId } as ProductView;
    component.selectedProduct = selectedProduct;
    component.addToCartForm.setValue({ quantity });

    jest.spyOn(mockCartService, 'addProductToCart').mockReturnValue(of({}));
    jest.spyOn(mockToastService, 'showToast');

    fixture.detectChanges();
    component.addToCart();

    expect(mockCartService.addProductToCart).toHaveBeenCalledWith(
      productId,
      quantity
    );
    expect(mockToastService.showToast).toHaveBeenCalledWith(
      'Product added to cart successfully',
      ToastType.Success
    );
  });

  it('should show error when adding product to cart fails', () => {
    const productId = 3;
    const quantity = 5;
    const selectedProduct = { productId } as ProductView;
    component.selectedProduct = selectedProduct;
    component.addToCartForm.setValue({ quantity });

    jest
      .spyOn(mockCartService, 'addProductToCart')
      .mockReturnValue(throwError(() => new Error('Error')));
    jest.spyOn(mockToastService, 'showToast');

    component.addToCart();

    expect(mockCartService.addProductToCart).toHaveBeenCalledWith(
      productId,
      quantity
    );
    expect(mockToastService.showToast).toHaveBeenCalledWith(
      'Error adding product to cart',
      ToastType.Error
    );
  });
  it('should load next supply date and set nextSupplyDateString', () => {
    const productId = 1;
    const nextSupplyDate = '2023-01-01';
    jest.spyOn(mockSupplyService, 'getNextSupplyDate').mockReturnValue(of({ nextSupplyDate }));

    component.loadNextSupplyDate(productId);

    expect(mockSupplyService.getNextSupplyDate).toHaveBeenCalledWith(productId);
    expect(component.nextSupplyDateString).toBe(nextSupplyDate);
  });

  it('should show an error toast if loading next supply date fails', () => {
    const productId = 1;
    jest.spyOn(mockSupplyService, 'getNextSupplyDate').mockReturnValue(throwError(() => new Error('Error')));

    component.loadNextSupplyDate(productId);

    expect(mockSupplyService.getNextSupplyDate).toHaveBeenCalledWith(productId);
    expect(mockToastService.showToast).toHaveBeenCalledWith('Error fetching next supply date', ToastType.Error);
  });
});

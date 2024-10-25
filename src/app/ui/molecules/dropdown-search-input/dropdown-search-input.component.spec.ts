import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CategoryService } from '@/app/shared/services/category/category.service';
import { BrandService } from '@/app/shared/services/brand/brand.service';
import { ProductService } from '@/app/shared/services/product/product.service';
import { ToastService } from '@/app/shared/services/toast/toast.service';
import { InputWithErrorComponent } from '@/app/ui/molecules/input-with-error/input-with-error.component';
import { TextAreaWithErrorComponent } from '@/app/ui/molecules/text-area-with-error/text-area-with-error.component';
import { DropdownSearchInputComponent } from '@/app/ui/molecules/dropdown-search-input/dropdown-search-input.component';
import { BrandResponse } from '@/app/shared/interfaces/brand.interface';
import { CategoryResponse } from '@/app/shared/interfaces/category.interface';
import { ProductResponse } from '@/app/shared/interfaces/product.interface';
import { ProductComponent } from '@/app/modules/product/product.component';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let categoryService: jest.Mocked<CategoryService>;
  let brandService: jest.Mocked<BrandService>;
  let productService: jest.Mocked<ProductService>;
  let toastService: jest.Mocked<ToastService>;

  beforeEach(async () => {
    categoryService = {
      getAllCategories: jest.fn().mockReturnValue(of([])),
    } as unknown as jest.Mocked<CategoryService>;

    brandService = {
      getAllBrands: jest.fn().mockReturnValue(of([])),
    } as unknown as jest.Mocked<BrandService>;

    productService = {
      createProduct: jest.fn().mockReturnValue(of({})),
      getProducts: jest.fn().mockReturnValue(of({
        content: [],
        totalElements: 0,
        totalPages: 0,
        currentPage: 0,
        isAscending: true,
      })),
    } as unknown as jest.Mocked<ProductService>;

    toastService = {
      showToast: jest.fn(),
    } as unknown as jest.Mocked<ToastService>;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [
        ProductComponent,
        InputWithErrorComponent,
        TextAreaWithErrorComponent,
        DropdownSearchInputComponent
      ],
      providers: [
        FormBuilder,
        { provide: CategoryService, useValue: categoryService },
        { provide: BrandService, useValue: brandService },
        { provide: ProductService, useValue: productService },
        { provide: ToastService, useValue: toastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on initialization', () => {
    const mockCategories: CategoryResponse[] = [{ categoryId: 1, categoryName: 'Dairy', categoryDescription: 'Milk and cheese' }];
    categoryService.getAllCategories = jest.fn().mockReturnValue(of(mockCategories));

    component.ngOnInit();

    expect(component.categories).toEqual(mockCategories);
    expect(categoryService.getAllCategories).toHaveBeenCalled();
  });

  it('should handle error when loading categories', () => {
    categoryService.getAllCategories = jest.fn().mockReturnValue(throwError(() => new Error('Error loading categories')));

    component.ngOnInit();

    expect(toastService.showToast).toHaveBeenCalledWith('Error loading categories', 'error');
  });

  it('should load brands on initialization', () => {
    const mockBrands: BrandResponse[] = [{ brandId: 1, brandName: 'Brand 1', brandDescription: 'Description' }];
    brandService.getAllBrands = jest.fn().mockReturnValue(of(mockBrands));

    component.ngOnInit();

    expect(component.brands).toEqual(mockBrands);
    expect(brandService.getAllBrands).toHaveBeenCalled();
  });

  it('should handle error when loading brands', () => {
    brandService.getAllBrands = jest.fn().mockReturnValue(throwError(() => new Error('Error loading brands')));

    component.ngOnInit();

    expect(toastService.showToast).toHaveBeenCalledWith('Error loading brands', 'error');
  });

  it('should open and close modal', () => {
    component.openModal();
    expect(component.isModalVisible).toBe(true);

    component.closeModal();
    expect(component.isModalVisible).toBe(false);
    expect(component.createProductForm.value).toEqual({
      productName: '',
      productDescription: '',
      productQuantity: '',
      productPrice: '',
      brandId: null,
      categoryIds: [],
    });
    expect(component.selectedCategories).toEqual([]);
    expect(component.selectedBrand).toBeNull();
  });

  it('should create a product when form is valid', () => {
    const mockProductResponse: ProductResponse = {
      productId: 1,
      productName: 'Milk',
      productDescription: 'Fresh Milk',
      productQuantity: 10,
      productPrice: 5.0,
      categories: [],
      brand: { brandName: 'Brand A' },
    };

    component.createProductForm.setValue({
      productName: 'Milk',
      productDescription: 'Fresh Milk',
      productQuantity: 10,
      productPrice: 5.0,
      brandId: 1,
      categoryIds: [1],
    });

    productService.createProduct = jest.fn().mockReturnValue(of(mockProductResponse));

    component.createProduct();

    expect(toastService.showToast).toHaveBeenCalledWith('Product created successfully', 'success');
    expect(productService.createProduct).toHaveBeenCalledWith(component.createProductForm.value);
  });

  it('should not create a product when form is invalid', () => {
    component.createProductForm.setValue({
      productName: '',
      productDescription: '',
      productQuantity: 0,
      productPrice: -5.0,
      brandId: null,
      categoryIds: [],
    });

    component.createProduct();

    expect(component.createProductForm.invalid).toBe(true);
    expect(toastService.showToast).not.toHaveBeenCalled();
  });

  it('should load products', () => {
    const mockProducts = {
      content: [],
      totalElements: 0,
      totalPages: 0,
      currentPage: 0,
      isAscending: true,
    };
    productService.getProducts = jest.fn().mockReturnValue(of(mockProducts));

    component.loadProducts();

    expect(component.products).toEqual(mockProducts.content);
    expect(component.totalElements).toEqual(mockProducts.totalElements);
    expect(productService.getProducts).toHaveBeenCalled();
  });

  it('should handle error when loading products', () => {
    productService.getProducts = jest.fn().mockReturnValue(throwError(() => new Error('Error loading products')));

    component.loadProducts();

    expect(toastService.showToast).toHaveBeenCalledWith('Error loading products', 'error');
  });

  it('should change page', () => {
    jest.spyOn(component, 'loadProducts');
    component.changePage(1);
    expect(component.currentPage).toBe(1);
    expect(component.loadProducts).toHaveBeenCalled();
  });

  it('should change sort order', () => {
    jest.spyOn(component, 'loadProducts');
    component.changeSortOrder('productName');
    expect(component.sortBy).toBe('productName');
    expect(component.isAscending).toBeFalsy();
    expect(component.loadProducts).toHaveBeenCalled();
  });

  it('should change rows per page', () => {
    jest.spyOn(component, 'loadProducts');
    component.onRowsPerPageChange(10);
    expect(component.pageSize).toBe(10);
    expect(component.loadProducts).toHaveBeenCalled();
  });

  it('should filter categories', () => {
    component.categories = [{ categoryId: 1, categoryName: 'Category 1', categoryDescription: 'Description' }];
    component.dropdownState['category'].searchTerm = 'Category 1';
    component.filterCategories();
    expect(component.filteredCategories).toEqual([{ categoryId: 1, categoryName: 'Category 1', categoryDescription: 'Description' }]);
  });

  it('should filter brands', () => {
    component.brands = [{ brandId: 1, brandName: 'Brand 1', brandDescription: 'Description' }];
    component.dropdownState['brand'].searchTerm = 'Brand 1';
    component.filterBrands();
    expect(component.filteredBrands).toEqual([{ brandId: 1, brandName: 'Brand 1', brandDescription: 'Description' }]);
  });

  it('should select category', () => {
    const category: CategoryResponse = { categoryId: 1, categoryName: 'Category 1', categoryDescription: 'Description' };
    component.selectCategory(category);
    expect(component.selectedCategories).toContain(category);
  });

  it('should remove category', () => {
    const category: CategoryResponse = { categoryId: 1, categoryName: 'Category 1', categoryDescription: 'Description' };
    component.selectedCategories = [category];
    component.removeCategory(category);
    expect(component.selectedCategories).not.toContain(category);
  });

  it('should select brand', () => {
    const brand: BrandResponse = { brandId: 1, brandName: 'Brand 1', brandDescription: 'Description' };
    component.selectBrand(brand);
    expect(component.selectedBrand).toBe(brand);
  });

  it('should set active dropdown', () => {
    component.setActiveDropdown('brand');
    expect(component.dropdownState['brand'].active).toBeTruthy();
    expect(component.dropdownState['category'].active).toBeFalsy();
  });

  it('should get product name error message', () => {
    component.createProductForm.controls['productName'].setErrors({ required: true });
    fixture.detectChanges();
    expect(component.productNameError).toBe('Product Name is required');
    component.createProductForm.controls['productName'].setErrors({ minlength: { requiredLength: 3, actualLength: 1 } });
    fixture.detectChanges();
    expect(component.productNameError).toBe('Product Name must be at least 3 characters long');
  });

  it('should get product description error message', () => {
    component.createProductForm.controls['productDescription'].setErrors({ required: true });
    fixture.detectChanges();
    expect(component.productDescriptionError).toBe('Product Description is required');
    component.createProductForm.controls['productDescription'].setErrors({ minlength: { requiredLength: 3, actualLength: 1 } });
    fixture.detectChanges();
    expect(component.productDescriptionError).toBe('Product Description must be at least 3 characters long');
  });

  it('should get product quantity error message', () => {
    component.createProductForm.controls['productQuantity'].setErrors({ required: true });
    fixture.detectChanges();
    expect(component.productQuantityError).toBe('Product Quantity is required');
    component.createProductForm.controls['productQuantity'].setErrors({ min: { min: 1, actual: 0 } });
    fixture.detectChanges();
    expect(component.productQuantityError).toBe('Product Quantity must be at least 1');
  });

  it('should get product price error message', () => {
    component.createProductForm.controls['productPrice'].setErrors({ required: true });
    fixture.detectChanges();
    expect(component.productPriceError).toBe('Product Price is required');
    component.createProductForm.controls['productPrice'].setErrors({ min: { min: 0.0, actual: -1 } });
    fixture.detectChanges();
    expect(component.productPriceError).toBe('Product Price must be at least 0.0');
  });

  it('should get brand id error message', () => {
    component.createProductForm.controls['brandId'].setErrors({ required: true });
    fixture.detectChanges();
    expect(component.brandIdError).toBe('Brand ID is required');
  });

  it('should get error message', () => {
    const control = component.createProductForm.controls['productName'];
    control.setErrors({ required: true });
    fixture.detectChanges();
    expect(component.getErrorMessage(control, 'Product Name')).toBe('Product Name is required');
    control.setErrors({ minlength: { requiredLength: 3, actualLength: 1 } });
    fixture.detectChanges();
    expect(component.getErrorMessage(control, 'Product Name')).toBe('Product Name must be at least 3 characters long');
  });

  it('should validate product name length', () => {
    const control = component.createProductForm.controls['productName'];
    control.setValue('ab');
    control.updateValueAndValidity();
    expect(control.errors?.['minlength']).toBeTruthy();

    control.setValue('abc');
    control.updateValueAndValidity();
    expect(control.errors).toBeNull();
  });

  it('should validate product price cannot be negative', () => {
    const control = component.createProductForm.controls['productPrice'];
    control.setValue(-1);
    control.updateValueAndValidity();
    expect(control.errors?.['min']).toBeTruthy();
  });

  it('should validate product quantity cannot be negative', () => {
    const control = component.createProductForm.controls['productQuantity'];
    control.setValue(-1);
    control.updateValueAndValidity();
    expect(control.errors?.['min']).toBeTruthy();
  });

  it('should call onSortChange and update sortBy and isAscending', () => {
    jest.spyOn(component, 'loadProducts');
    component.onSortChange({ sortBy: 'productName', isAscending: false });
    expect(component.sortBy).toBe('productName');
    expect(component.isAscending).toBe(false);
    expect(component.loadProducts).toHaveBeenCalled();
  });

  it('should call onSearchTermChange and filter categories', () => {
    jest.spyOn(component, 'filterCategories');
    component.onSearchTermChange('category', 'Category 1');
    expect(component.dropdownState['category'].searchTerm).toBe('Category 1');
    expect(component.filterCategories).toHaveBeenCalled();
  });

  it('should call onSearchTermChange and filter brands', () => {
    jest.spyOn(component, 'filterBrands');
    component.onSearchTermChange('brand', 'Brand 1');
    expect(component.dropdownState['brand'].searchTerm).toBe('Brand 1');
    expect(component.filterBrands).toHaveBeenCalled();
  });

  it('should open modal', () => {
    component.openModal();
    expect(component.isModalVisible).toBe(true);
  });

  it('should call openModal on Enter key press', () => {
    jest.spyOn(component, 'openModal');
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    component.onKeyDownButton(event);
    expect(component.openModal).toHaveBeenCalled();
  });

  it('should call openModal on Space key press', () => {
    jest.spyOn(component, 'openModal');
    const event = new KeyboardEvent('keydown', { key: ' ' });
    component.onKeyDownButton(event);
    expect(component.openModal).toHaveBeenCalled();
  });

  it('should not call openModal on other key press', () => {
    jest.spyOn(component, 'openModal');
    const event = new KeyboardEvent('keydown', { key: 'a' });
    component.onKeyDownButton(event);
    expect(component.openModal).not.toHaveBeenCalled();
  });
});
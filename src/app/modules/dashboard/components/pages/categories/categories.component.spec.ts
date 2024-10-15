import { TestBed } from '@angular/core/testing';
import { CategoriesComponent } from './categories.component';
import { CategoryService } from '../../../services/category.service';
import { ToastService, ToastType } from 'src/app/core/services/toast.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { ERROR_MESSAGES_BY_CODE } from '@/app/shared/constants/categoriesComponent';

describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let categoryService: CategoryService;
  let toastService: ToastService;

  beforeEach(async () => {
    const categoryServiceMock = {
      createCategory: jest.fn(),
      getCategories: jest.fn(),
    };

    const toastServiceMock = {
      showToast: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [CategoriesComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: CategoryService, useValue: categoryServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
      ],
    }).compileComponents();

    component = TestBed.createComponent(CategoriesComponent).componentInstance;
    categoryService = TestBed.inject(CategoryService);
    toastService = TestBed.inject(ToastService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.createCategoryForm).toBeDefined();
  });

  it('should load categories on ngOnInit', () => {
    const mockResponse = {
      content: [
        { categoryName: 'Category1', categoryDescription: 'Description1' },
      ],
      totalElements: 1,
      totalPages: 1,
      currentPage: 0,
      isAscending: true,
    };
    jest
      .spyOn(categoryService, 'getCategories')
      .mockReturnValue(of(mockResponse));

    component.ngOnInit();
    expect(component.categories.length).toBe(1);
    expect(component.totalElements).toBe(1);
    expect(component.totalPages).toBe(1);
    expect(component.currentPage).toBe(0);
  });

  it('should show toast on category creation success', () => {
    const mockResponse = new HttpResponse({
      body: { categoryName: 'Category1', categoryDescription: 'Description1' },
      status: HttpStatusCode.Created,
    });
    jest
      .spyOn(categoryService, 'createCategory')
      .mockReturnValue(of(mockResponse));

    component.createCategoryForm.setValue({
      categoryName: 'Category1',
      categoryDescription: 'Description1',
    });

    component.createCategory();

    expect(toastService.showToast).toHaveBeenCalledWith(
      'Category created successfully!',
      ToastType.Success
    );
    expect(categoryService.getCategories).toHaveBeenCalled();
  });

  it('should show error toast on category creation error', () => {
    const mockError = { status: 400 };
    jest
      .spyOn(categoryService, 'createCategory')
      .mockReturnValue(throwError(() => mockError));

    component.createCategoryForm.setValue({
      categoryName: 'Invalid',
      categoryDescription: 'Invalid',
    });

    component.createCategory();

    expect(toastService.showToast).toHaveBeenCalledWith(
      'An error occurred while creating the category.',
      ToastType.Error
    );
  });

  it('should reset form after successful category creation', () => {
    const mockResponse = new HttpResponse({
      body: { categoryName: 'Category1', categoryDescription: 'Description1' },
      status: HttpStatusCode.Created,
    });
    jest
      .spyOn(categoryService, 'createCategory')
      .mockReturnValue(of(mockResponse));

    component.createCategoryForm.setValue({
      categoryName: 'Category1',
      categoryDescription: 'Description1',
    });

    component.createCategory();

    expect(component.createCategoryForm.value).toEqual({
      categoryName: '',
      categoryDescription: '',
    });
  });

  it('should change page and load categories', () => {
    jest.spyOn(categoryService, 'getCategories').mockReturnValue(
      of({
        content: [],
        totalElements: 5,
        totalPages: 2,
        currentPage: 1,
        isAscending: true,
      })
    );

    component.changePage(2);

    expect(categoryService.getCategories).toHaveBeenCalledWith(
      1,
      5,
      'categoryName',
      true
    );

    expect(component.currentPage).toBe(1);
  });

  it('should change sort order and reload categories', () => {
    jest.spyOn(categoryService, 'getCategories').mockReturnValue(
      of({
        content: [],
        totalElements: 5,
        totalPages: 2,
        currentPage: 0,
        isAscending: false,
      })
    );

    component.changeSortOrder('categoryName');

    expect(categoryService.getCategories).toHaveBeenCalledWith(
      0,
      5,
      'categoryName',
      true
    );
  });

  it('should show error toast on loadCategories error', () => {
    const mockError = { status: 404 };
    jest.spyOn(categoryService, 'getCategories').mockReturnValue(throwError(() => mockError));
  
    component.loadCategories();
  
    expect(toastService.showToast).toHaveBeenCalledWith(
      ERROR_MESSAGES_BY_CODE[404],
      ToastType.Error
    );
  });

  it('should open modal', () => {
    component.openModal();
    expect(component.isModalVisible).toBeTruthy();
  });

  it('should close modal and reset form', () => {
    component.closeModal();
    expect(component.isModalVisible).toBeFalsy();
    expect(component.createCategoryForm.value).toEqual({
      categoryName: '',
      categoryDescription: '',
    });
  });

  it('should trigger open modal on Enter key', () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    component.onKeyDownButton(event);
    expect(component.isModalVisible).toBeTruthy();
  });

  it('should trigger open modal on Space key', () => {
    const event = new KeyboardEvent('keydown', { key: ' ' });
    component.onKeyDownButton(event);
    expect(component.isModalVisible).toBeTruthy();
  });

  it('should change rows per page and load categories', () => {
    component.onRowsPerPageChange(10);
    expect(component.pageSize).toBe(10);
    expect(categoryService.getCategories).toHaveBeenCalledWith(
      component.currentPage,
      component.pageSize,
      component.sortBy,
      component.isAscending
    );
  });

  it('should return the correct error message for touched control with errors', () => {
    const control = component.categoryName;
    control?.setErrors({ required: true });
    control?.markAsTouched();

    const errorMessage = component.getErrorMessage(control, 'Category Name');
    expect(errorMessage).toBe('Category Name is required.');
  });

  it('should return an empty string if control is not touched', () => {
    const control = component.categoryName;
    control?.setErrors({ required: true });
    control?.markAsUntouched();

    const errorMessage = component.getErrorMessage(control, 'Category Name');
    expect(errorMessage).toBe('');
  });

  it('should return an empty string if control has no errors', () => {
    const control = component.categoryName;
    control?.setErrors(null);
    control?.markAsTouched();

    const errorMessage = component.getErrorMessage(control, 'Category Name');
    expect(errorMessage).toBe('');
  });

  it('should mark all controls as touched if form is invalid', () => {
    component.createCategoryForm.setValue({
      categoryName: '',
      categoryDescription: '',
    });

    const markAllAsTouchedSpy = jest.spyOn(component.createCategoryForm, 'markAllAsTouched');
    
    component.createCategory();

    expect(markAllAsTouchedSpy).toHaveBeenCalled();
    expect(categoryService.createCategory).not.toHaveBeenCalled();
  });

});
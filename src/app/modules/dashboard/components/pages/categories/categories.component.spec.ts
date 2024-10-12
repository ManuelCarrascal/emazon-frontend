import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CategoriesComponent } from './categories.component';
import { CategoryService } from '../../../services/category.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Category, CategoryResponse } from '../../../interfaces/category.interface';
import { ERROR_CODES, ERROR_MESSAGES, ERROR_MESSAGES_BY_CODE, FIELD_NAMES, SUCCESS_MESSAGES } from 'src/app/shared/constants/categoriesComponent';

describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;
  let categoryService: jest.Mocked<CategoryService>;
  let toastService: jest.Mocked<ToastService>;

  beforeEach(async () => {
    categoryService = {
      getCategories: jest.fn(),
      createCategory: jest.fn(),
    } as unknown as jest.Mocked<CategoryService>;

    toastService = {
      showToast: jest.fn(),
    } as unknown as jest.Mocked<ToastService>;

    await TestBed.configureTestingModule({
      declarations: [CategoriesComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: CategoryService, useValue: categoryService },
        { provide: ToastService, useValue: toastService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    const mockResponse = {
      content: [{ categoryName: 'Test Category' }] as CategoryResponse[],
      totalElements: 1,
      totalPages: 1,
      currentPage: 0,
      isAscending: true,
    };

    categoryService.getCategories.mockReturnValue(of(mockResponse));
    component.ngOnInit();
    expect(component.categories).toEqual(mockResponse.content);
    expect(component.totalElements).toEqual(mockResponse.totalElements);
    expect(component.totalPages).toEqual(mockResponse.totalPages);
    expect(component.currentPage).toEqual(mockResponse.currentPage);
  });

  it('should handle error when loading categories', () => {
    const errorResponse = { status: 404 };
    categoryService.getCategories.mockReturnValue(throwError(() => errorResponse));
    component.loadCategories();

    expect(toastService.showToast).toHaveBeenCalledWith(ERROR_MESSAGES_BY_CODE[ERROR_CODES.BAD_REQUEST], 'Error');
  });

  it('should create a category successfully', () => {
    const formValue = { categoryName: 'New Category', categoryDescription: 'Description' };
    component.createCategoryForm.setValue(formValue);

    const mockResponse = new HttpResponse<Category>({ status: 201 });
    categoryService.createCategory.mockReturnValue(of(mockResponse));

    component.createCategory();

    expect(toastService.showToast).toHaveBeenCalledWith(SUCCESS_MESSAGES.CATEGORY_CREATED, 'success');
    expect(component.createCategoryForm.value).toEqual({ categoryName: '', categoryDescription: '' });
  });

  it('should handle error when creating a category', () => {
    const formValue = { categoryName: 'New Category', categoryDescription: 'Description' };
    component.createCategoryForm.setValue(formValue);

    const errorResponse = { status: 400 };
    categoryService.createCategory.mockReturnValue(throwError(() => errorResponse));

    component.createCategory();

    expect(toastService.showToast).toHaveBeenCalledWith(ERROR_MESSAGES_BY_CODE[400], 'error');
  });

  it('should mark form as touched when invalid', () => {
    component.createCategoryForm.controls['categoryName'].setValue('');
    component.createCategory();
    expect(component.createCategoryForm.controls['categoryName'].touched).toBeTruthy();
  });

  it('should open modal', () => {
    component.openModal();
    expect(component.isModalVisible).toBeTruthy();
  });

  it('should close modal and reset form', () => {
    component.isModalVisible = true;
    component.closeModal();
    expect(component.isModalVisible).toBeFalsy();
    expect(component.createCategoryForm.value).toEqual({ categoryName: '', categoryDescription: '' });
  });

  it('should change page correctly', () => {
    component.totalPages = 3;
    component.changePage(1);
    expect(component.currentPage).toBe(1);
    expect(categoryService.getCategories).toHaveBeenCalledWith(1, component.pageSize, component.sortBy, component.isAscending);
  });

  it('should not change page out of bounds', () => {
    component.totalPages = 3;
    component.changePage(5);
    expect(component.currentPage).toBe(0);
  });

  it('should toggle sort order and load categories', () => {
    const mockResponse = {
      content: [{ categoryName: 'Test Category' }] as CategoryResponse[],
      totalElements: 1,
      totalPages: 1,
      currentPage: 0,
      isAscending: true,
    };

    categoryService.getCategories.mockReturnValue(of(mockResponse));

    component.sortBy = 'categoryName';
    component.isAscending = true;
    component.changeSortOrder('categoryDescription');

    expect(component.sortBy).toBe('categoryDescription');
    expect(component.isAscending).toBeFalsy();
    expect(categoryService.getCategories).toHaveBeenCalledWith(component.currentPage, component.pageSize, 'categoryDescription', false);
  });

  it('should show ellipsis correctly', () => {
    component.currentPage = 2;
    component.totalPages = 6;
    expect(component.shouldShowEllipsis()).toBeTruthy();
  });

  it('should show last page correctly', () => {
    component.currentPage = 2;
    component.totalPages = 6;
    expect(component.shouldShowLastPage()).toBeTruthy();
  });

  it('should prevent default on key down for sort order', () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    const spy = jest.spyOn(event, 'preventDefault');
    component.onKeyDown(event, 'categoryName');
    expect(spy).toHaveBeenCalled();
  });

  it('should prevent default on key down for modal', () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    const spy = jest.spyOn(event, 'preventDefault');
    component.onKeyDownButton(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should return error message for invalid controls', () => {
    const control = component.categoryName;
    control!.setErrors({ required: true });
    const errorMessage = component.getErrorMessage(control, FIELD_NAMES.CATEGORY_NAME);
    expect(errorMessage).toBe(ERROR_MESSAGES.required(FIELD_NAMES.CATEGORY_NAME)); 
  });

  it('should return empty string for valid controls', () => {
    const control = component.categoryName;
    control!.setValue('Valid Category'); 
    const errorMessage = component.getErrorMessage(control, FIELD_NAMES.CATEGORY_NAME);
    expect(errorMessage).toBe('');
  });

  it('should get pages to show correctly', () => {
    component.totalPages = 10;
    component.currentPage = 5;
    const pagesToShow = component.getPagesToShow();
    expect(pagesToShow).toEqual([3, 4, 5, 6, 7]); 
  });

  it('should show modal', () => {
    component.openModal();
    expect(component.isModalVisible).toBeTruthy();
  });

  it('should close modal and reset form', () => {
    component.isModalVisible = true;
    component.closeModal();
    expect(component.isModalVisible).toBeFalsy();
    expect(component.createCategoryForm.value).toEqual({ categoryName: '', categoryDescription: '' });
    expect(component.createCategoryForm.touched).toBeFalsy();
    expect(component.createCategoryForm.pristine).toBeTruthy();
  });

  it('should handle page change correctly when changing pages', () => {
    component.currentPage = 2;
    component.totalPages = 5;
    component.changePage(3);
    expect(component.currentPage).toBe(3);
  });

  it('should not change page when out of bounds', () => {
    component.currentPage = 2;
    component.totalPages = 5;
    component.changePage(5); 
    expect(component.currentPage).toBe(2);
  });

  it('should toggle sort order and load categories', () => {
    component.sortBy = 'categoryName';
    component.isAscending = true;
    component.changeSortOrder('categoryDescription');
    expect(component.sortBy).toBe('categoryDescription');
    expect(component.isAscending).toBeFalsy();
  });

  it('should prevent default on key down for sort order', () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    const spy = jest.spyOn(event, 'preventDefault');
    component.onKeyDown(event, 'categoryName');
    expect(spy).toHaveBeenCalled();
  });

  it('should prevent default on key down for modal', () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    const spy = jest.spyOn(event, 'preventDefault');
    component.onKeyDownButton(event);
    expect(spy).toHaveBeenCalled();
  });
});
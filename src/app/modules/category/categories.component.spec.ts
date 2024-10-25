import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { CategoriesComponent } from './categories.component';
import { CategoryService } from '@/app/shared/services/category/category.service';
import { ToastService, ToastType } from '@/app/shared/services/toast/toast.service';
import { InputWithErrorComponent } from '@/app/ui/molecules/input-with-error/input-with-error.component';
import { TextAreaWithErrorComponent } from '@/app/ui/molecules/text-area-with-error/text-area-with-error.component';
import { ERROR_MESSAGES_BY_CODE, SUCCESS_MESSAGES } from '@/app/shared/constants/categoriesComponent';
import { Category } from '@/app/shared/interfaces/category.interface';

describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;
  let categoryService: jest.Mocked<CategoryService>;
  let toastService: jest.Mocked<ToastService>;

  beforeEach(async () => {
    const categoryServiceMock = {
      createCategory: jest.fn(),
      getCategories: jest.fn().mockReturnValue(
        of({
          content: [],
          totalElements: 5,
          totalPages: 2,
          currentPage: 0,
        })
      ),
    };

    const toastServiceMock = {
      showToast: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [
        CategoriesComponent,
        InputWithErrorComponent,
        TextAreaWithErrorComponent,
      ],
      providers: [
        { provide: CategoryService, useValue: categoryServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.inject(CategoryService) as jest.Mocked<CategoryService>;
    toastService = TestBed.inject(ToastService) as jest.Mocked<ToastService>;
    fixture.detectChanges();
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
      content: [{ categoryName: 'Category1', categoryDescription: 'Description1' }],
      totalElements: 1,
      totalPages: 1,
      currentPage: 0,
      isAscending: true,
    };
    jest.spyOn(categoryService, 'getCategories').mockReturnValue(of(mockResponse));

    component.ngOnInit();

    expect(component.categories.length).toBe(1);
    expect(component.totalElements).toBe(1);
    expect(component.totalPages).toBe(1);
    expect(component.currentPage).toBe(0);
  });

  describe('createCategory', () => {
    it('should not call createCategory if the form is invalid', () => {
      component.createCategoryForm.patchValue({
        categoryName: '',
        categoryDescription: '',
      });
      component.createCategory();
      expect(categoryService.createCategory).not.toHaveBeenCalled();
    });

    it('should call createCategory and show success toast on successful creation', () => {
      jest.spyOn(categoryService, 'createCategory').mockReturnValue(
        of(new HttpResponse<Category>({ status: 201 }))
      );
      jest.spyOn(toastService, 'showToast');

      component.createCategoryForm.setValue({
        categoryName: 'Valid Category',
        categoryDescription: 'Valid Description',
      });

      component.createCategory();

      expect(categoryService.createCategory).toHaveBeenCalledWith({
        categoryName: 'Valid Category',
        categoryDescription: 'Valid Description',
      });
      expect(toastService.showToast).toHaveBeenCalledWith(
        SUCCESS_MESSAGES.CATEGORY_CREATED,
        ToastType.Success
      );
    });

    it('should show error toast when category creation fails', () => {
      const mockError = { status: 400 };
      jest.spyOn(categoryService, 'createCategory').mockReturnValue(throwError(() => mockError));

      component.createCategoryForm.patchValue({
        categoryName: 'Test Category',
        categoryDescription: 'Test Description',
      });

      component.createCategory();

      expect(toastService.showToast).toHaveBeenCalledWith(
        ERROR_MESSAGES_BY_CODE[400],
        ToastType.Error
      );
    });

    it('should reset form after successful category creation', () => {
      const mockResponse = new HttpResponse({
        body: { categoryName: 'Category1', categoryDescription: 'Description1' },
        status: HttpStatusCode.Created,
      });
      jest.spyOn(categoryService, 'createCategory').mockReturnValue(of(mockResponse));

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
  });

  describe('loadCategories', () => {
    it('should load categories and update the component state', () => {
      const mockData = {
        content: [{ categoryName: 'Category 1', categoryDescription: 'Description 1' }],
        totalElements: 1,
        totalPages: 1,
        currentPage: 0,
        isAscending: true,
      };
      jest.spyOn(categoryService, 'getCategories').mockReturnValue(of(mockData));

      component.loadCategories();

      expect(categoryService.getCategories).toHaveBeenCalledWith(
        0,
        5,
        'categoryName',
        true
      );
      expect(component.categories).toEqual(mockData.content);
      expect(component.totalElements).toBe(mockData.totalElements);
      expect(component.totalPages).toBe(mockData.totalPages);
    });

    it('should show error toast if loading categories fails', () => {
      const mockError = { status: 500 };
      jest.spyOn(categoryService, 'getCategories').mockReturnValue(throwError(() => mockError));

      component.loadCategories();

      expect(toastService.showToast).toHaveBeenCalledWith(
        ERROR_MESSAGES_BY_CODE[500],
        ToastType.Error
      );
    });
  });

  describe('pagination and sorting', () => {
    it('should change page and reload categories', () => {
      jest.spyOn(component, 'loadCategories');

      component.changePage(1);

      expect(component.loadCategories).toHaveBeenCalledWith(
        1,
        component.pageSize,
        component.sortBy,
        component.isAscending
      );
    });

    it('should change sort order and reload categories', () => {
      jest.spyOn(component, 'loadCategories');

      component.isAscending = true;
      component.changeSortOrder('categoryName');

      expect(component.sortBy).toBe('categoryName');
      expect(component.isAscending).toBe(false);
      expect(component.loadCategories).toHaveBeenCalledWith(
        component.currentPage,
        component.pageSize,
        'categoryName',
        false
      );
    });

    it('should change page size and reload categories', () => {
      jest.spyOn(component, 'loadCategories');

      component.onRowsPerPageChange(10);

      expect(component.pageSize).toBe(10);
      expect(component.loadCategories).toHaveBeenCalledWith(
        component.currentPage,
        10,
        component.sortBy,
        component.isAscending
      );
    });
  });

  describe('modal visibility', () => {
    it('should open the modal when openModal is called', () => {
      component.openModal();
      expect(component.isModalVisible).toBeTruthy();
    });

    it('should close the modal and reset the form when closeModal is called', () => {
      component.closeModal();

      expect(component.isModalVisible).toBeFalsy();
      expect(component.createCategoryForm.pristine).toBeTruthy();
      expect(component.createCategoryForm.untouched).toBeTruthy();
      expect(component.createCategoryForm.value).toEqual({
        categoryName: '',
        categoryDescription: '',
      });
    });
  });

  describe('confirmDelete', () => {
    it('should close the modal', () => {
      jest.spyOn(component, 'closeModal');

      component.confirmDelete();

      expect(component.closeModal).toHaveBeenCalled();
    });
  });

  describe('onKeyDownButton', () => {
    it('should open the modal on Enter key press', () => {
      jest.spyOn(component, 'openModal');
      const event = new KeyboardEvent('keydown', { key: 'Enter' });

      component.onKeyDownButton(event);

      expect(component.openModal).toHaveBeenCalled();
    });

    it('should open the modal on Space key press', () => {
      jest.spyOn(component, 'openModal');
      const event = new KeyboardEvent('keydown', { key: ' ' });

      component.onKeyDownButton(event);

      expect(component.openModal).toHaveBeenCalled();
    });
  });

  describe('getErrorMessage', () => {
    it('should return the correct error message for touched control with errors', () => {
      const control = component.createCategoryForm.get('categoryName');
      control?.setErrors({ required: true });
      control?.markAsTouched();

      const errorMessage = component.getErrorMessage(control, 'Category Name');
      expect(errorMessage).toBe('Category Name is required.');
    });

    it('should return an empty string if control is not touched', () => {
      const control = component.createCategoryForm.get('categoryName');
      control?.setErrors({ required: true });

      const errorMessage = component.getErrorMessage(control, 'Category Name');
      expect(errorMessage).toBe('');
    });

    it('should return an empty string if control is valid', () => {
      const control = component.createCategoryForm.get('categoryName');
      control?.setValue('Valid Category');

      const errorMessage = component.getErrorMessage(control, 'Category Name');
      expect(errorMessage).toBe('');
    });
  });
});
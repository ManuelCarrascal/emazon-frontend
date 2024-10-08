import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoriesComponent } from './categories.component';
import { CategoryService } from '../../../services/category.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Category } from '../../../interfaces/category.interface';

class MockCategoryService {
  createCategory = jest.fn();
}

class MockToastService {
  showToast = jest.fn();
}

describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;
  let categoryService: MockCategoryService;
  let toastService: MockToastService;

  beforeEach(async () => {
    categoryService = new MockCategoryService();
    toastService = new MockToastService();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [CategoriesComponent],
      providers: [
        { provide: CategoryService, useValue: categoryService },
        { provide: ToastService, useValue: toastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    expect(component.createCategoryForm).toBeTruthy();
    expect(component.createCategoryForm.get('categoryName')).toBeTruthy();
    expect(component.createCategoryForm.get('categoryDescription')).toBeTruthy();
  });

  it('should return error message for invalid category name', () => {
    const control = component.categoryName;
    control?.setErrors({ required: true });
    const message = component.getErrorMessage(control, 'Category Name');
    expect(message).toContain('Category Name is required');
  });

  it('should create a category successfully', () => {
    const mockResponse = new HttpResponse<Category>({ status: 201, body: { categoryName: '', categoryDescription: '' } });
    categoryService.createCategory.mockReturnValue(of(mockResponse));
  
    component.createCategoryForm.setValue({
      categoryName: 'Test Category',
      categoryDescription: 'Test Description',
    });
  
    component.createCategory();
  
    expect(categoryService.createCategory).toHaveBeenCalledWith({
      categoryName: 'Test Category',
      categoryDescription: 'Test Description',
    });
    expect(toastService.showToast).toHaveBeenCalledWith(
      'Category created successfully!',
      'success'
    );
    expect(component.createCategoryForm.value).toEqual({
      categoryName: '',
      categoryDescription: '',
    });
  });
  

  it('should handle error when creating a category', () => {
    const errorResponse = { status: 400 };
    categoryService.createCategory.mockReturnValue(throwError(() => errorResponse));

    component.createCategoryForm.setValue({
      categoryName: 'Invalid Category',
      categoryDescription: 'Invalid Description',
    });

    component.createCategory();

    expect(toastService.showToast).toHaveBeenCalledWith(
      'An error occurred while creating the category.',
      'error' 
    );
  });

  it('should open modal', () => {
    expect(component.isModalVisible).toBe(false);
    component.openModal();
    expect(component.isModalVisible).toBe(true);
  });

  it('should close modal', () => {
    component.isModalVisible = true;
    component.closeModal();
    expect(component.isModalVisible).toBe(false);
  });
});

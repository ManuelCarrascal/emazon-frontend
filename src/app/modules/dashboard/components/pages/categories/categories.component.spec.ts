import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CategoriesComponent } from './categories.component';
import { CategoryService } from '../../../services/category.service';
import { ToastService, ToastType } from 'src/app/core/services/toast.service';
import { HttpResponse } from '@angular/common/http';
import { Category } from '../../../interfaces/category.interface';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, FIELD_NAMES, GENERIC_ERROR_MESSAGE } from 'src/app/shared/constants/categoriesComponent';

jest.mock('../../../../../environments/environment', () => ({
  environment: {
    production: false,
    stock_service_url: 'http://localhost:9091/categories',
    auth_token: 'mocked-token',
  },
}));

describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;
  let categoryServiceMock: any;
  let toastServiceMock: any;

  beforeEach(async () => {
    categoryServiceMock = {
      createCategory: jest.fn(),
    };

    toastServiceMock = {
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return error message for categoryNameError when control has errors', () => {
    component.categoryName?.setErrors({ required: true });
    component.categoryName?.markAsTouched();
    expect(component.categoryNameError).toBe(ERROR_MESSAGES.required(FIELD_NAMES.CATEGORY_NAME));
  });

  it('should return empty string for categoryNameError when control has no errors', () => {
    expect(component.categoryNameError).toBe('');
  });

  it('should create category when form is valid', () => {
    component.createCategoryForm.setValue({
      categoryName: 'Valid Name',
      categoryDescription: 'Valid Description',
    });

    const response = new HttpResponse<Category>({ status: 201 });
    categoryServiceMock.createCategory.mockReturnValue(of(response));

    component.createCategory();

    expect(categoryServiceMock.createCategory).toHaveBeenCalledWith(component.createCategoryForm.value);
    expect(toastServiceMock.showToast).toHaveBeenCalledWith(SUCCESS_MESSAGES.CATEGORY_CREATED, ToastType.Success);
    expect(component.createCategoryForm.pristine).toBe(true);
  });

  it('should show error messages when form is invalid', () => {
    component.createCategoryForm.markAllAsTouched();
    component.createCategoryForm.setErrors({ invalid: true });
    component.createCategory();

    expect(component.createCategoryForm.touched).toBe(true);
    expect(toastServiceMock.showToast).not.toHaveBeenCalled();
  });

  it('should show error toast on createCategory error', () => {
    component.createCategoryForm.setValue({
      categoryName: 'Valid Name',
      categoryDescription: 'Valid Description',
    });

    categoryServiceMock.createCategory.mockReturnValue(throwError(() => new Error('Internal Server Error')));

    component.createCategory();

    expect(toastServiceMock.showToast).toHaveBeenCalledWith(GENERIC_ERROR_MESSAGE, ToastType.Error);
  });
});

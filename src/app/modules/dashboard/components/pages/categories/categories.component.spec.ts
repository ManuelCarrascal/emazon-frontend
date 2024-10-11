import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CategoriesComponent } from './categories.component';
import { CategoryService } from '../../../services/category.service';
import { ToastService, ToastType } from 'src/app/core/services/toast.service';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Category } from '../../../interfaces/category.interface';
import {
  ERROR_MESSAGES,
  ERROR_MESSAGES_BY_CODE,
  SUCCESS_MESSAGES,
  REGEX_PATTERNS,
  FIELD_NAMES,
} from 'src/app/shared/constants/categoriesComponent';

class MockCategoryService {
  getCategories() {
    return of([]);
  }
  createCategory(category: Category) {
    return of(new HttpResponse({ status: HttpStatusCode.Created, body: category }));
  }
}

class MockToastService {
  showToast(message: string, type: ToastType) {
    console.log(`Toast message: ${message}, Type: ${type}`);
  }
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

  it('should load categories on init', () => {
    const spy = spyOn(categoryService, 'getCategories').and.returnValue(of([{ id: 1, name: 'Test Category' }]));
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(component.categories.length).toBe(1);
  });

  it('should show error message when loading categories fails', () => {
    const spy = spyOn(categoryService, 'getCategories').and.returnValue(throwError(() => ({ status: 500 })));
    const toastSpy = spyOn(toastService, 'showToast');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(toastSpy).toHaveBeenCalledWith(ERROR_MESSAGES_BY_CODE[500], ToastType.Error);
  });

  it('should mark form as touched if invalid on createCategory', () => {
    component.createCategoryForm.controls['categoryName'].setValue('');
    component.createCategory();
    expect(component.createCategoryForm.touched).toBeTruthy();
  });

  it('should create category successfully', () => {
    const spy = spyOn(categoryService, 'createCategory').and.returnValue(of(new HttpResponse({ status: HttpStatusCode.Created })));
    const toastSpy = spyOn(toastService, 'showToast');
    component.createCategoryForm.controls['categoryName'].setValue('Valid Name');
    component.createCategoryForm.controls['categoryDescription'].setValue('Valid Description');
    component.createCategory();
    expect(spy).toHaveBeenCalled();
    expect(toastSpy).toHaveBeenCalledWith(SUCCESS_MESSAGES.CATEGORY_CREATED, ToastType.Success);
    expect(component.createCategoryForm.pristine).toBeTruthy();
    expect(component.createCategoryForm.untouched).toBeTruthy();
  });

  it('should show error message when creating category fails', () => {
    const spy = spyOn(categoryService, 'createCategory').and.returnValue(throwError(() => ({ status: 500 })));
    const toastSpy = spyOn(toastService, 'showToast');
    component.createCategoryForm.controls['categoryName'].setValue('Valid Name');
    component.createCategoryForm.controls['categoryDescription'].setValue('Valid Description');
    component.createCategory();
    expect(spy).toHaveBeenCalled();
    expect(toastSpy).toHaveBeenCalledWith(ERROR_MESSAGES_BY_CODE[500], ToastType.Error);
  });

  it('should reset form and reload categories after creating category', () => {
    const spy = spyOn(categoryService, 'createCategory').and.returnValue(of(new HttpResponse({ status: HttpStatusCode.Created })));
    const loadCategoriesSpy = spyOn(component, 'loadCategories');
    component.createCategoryForm.controls['categoryName'].setValue('Valid Name');
    component.createCategoryForm.controls['categoryDescription'].setValue('Valid Description');
    component.createCategory();
    expect(spy).toHaveBeenCalled();
    expect(loadCategoriesSpy).toHaveBeenCalled();
    expect(component.createCategoryForm.pristine).toBeTruthy();
    expect(component.createCategoryForm.untouched).toBeTruthy();
  });

  it('should return correct error message for required field', () => {
    const control = component.createCategoryForm.controls['categoryName'];
    control.setErrors({ required: true });
    const errorMessage = component.getErrorMessage(control, FIELD_NAMES.CATEGORY_NAME);
    expect(errorMessage).toBe(ERROR_MESSAGES.required(FIELD_NAMES.CATEGORY_NAME));
  });

  it('should return correct error message for pattern mismatch', () => {
    const control = component.createCategoryForm.controls['categoryName'];
    control.setErrors({ pattern: { requiredPattern: REGEX_PATTERNS.FORBIDDEN_CHARACTERS } });
    const errorMessage = component.getErrorMessage(control, FIELD_NAMES.CATEGORY_NAME);
    expect(errorMessage).toBe(ERROR_MESSAGES.pattern());
  });

  it('should return correct categoryNameError', () => {
    const control = component.createCategoryForm.controls['categoryName'];
    control.setErrors({ required: true });
    const errorMessage = component.categoryNameError;
    expect(errorMessage).toBe(ERROR_MESSAGES.required(FIELD_NAMES.CATEGORY_NAME));
  });

  it('should return correct categoryDescriptionError', () => {
    const control = component.createCategoryForm.controls['categoryDescription'];
    control.setErrors({ required: true });
    const errorMessage = component.categoryDescriptionError;
    expect(errorMessage).toBe(ERROR_MESSAGES.required(FIELD_NAMES.CATEGORY_DESCRIPTION));
  });

  it('should open modal', () => {
    component.openModal();
    expect(component.isModalVisible).toBeTruthy();
  });

  it('should close modal and reset form', () => {
    component.closeModal();
    expect(component.isModalVisible).toBeFalsy();
    expect(component.createCategoryForm.pristine).toBeTruthy();
    expect(component.createCategoryForm.untouched).toBeTruthy();
  });

  it('should close modal on confirmDelete', () => {
    component.isModalVisible = true;
    component.confirmDelete();
    expect(component.isModalVisible).toBeFalsy();
  });
});
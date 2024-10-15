import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrandsPageComponent } from './brands-page.component';
import { ToastService, ToastType } from '@/app/core/services/toast.service';
import { BrandService } from '../../../services/brand.service';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ModalComponent } from '@/app/shared/components/modal/modal.component';
import { InputWithErrorComponent } from '@/app/shared/components/molecules/input-with-error/input-with-error.component';
import { TextAreaWithErrorComponent } from '@/app/shared/components/molecules/text-area-with-error/text-area-with-error.component';
import { DataTableComponent } from '../../organisms/data-table/data-table.component';
import { ButtonComponent } from '@/app/shared/components/atoms/button/button.component';
import { BrandResponse } from '../../../interfaces/brand.interface';

describe('BrandsPageComponent', () => {
  let component: BrandsPageComponent;
  let fixture: ComponentFixture<BrandsPageComponent>;
  let brandService: BrandService;
  let toastService: ToastService;

  beforeEach(async () => {
    const brandServiceMock = {
      createBrand: jest.fn(),
      getBrands: jest.fn().mockReturnValue(
        of({
          content: [],
          totalElements: 0,
          totalPages: 0,
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
        BrandsPageComponent,
        InputWithErrorComponent,
        TextAreaWithErrorComponent,
        ModalComponent,
        DataTableComponent,
        ButtonComponent,
      ],
      providers: [
        { provide: BrandService, useValue: brandServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandsPageComponent);
    component = fixture.componentInstance;
    brandService = TestBed.inject(BrandService);
    toastService = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form in the constructor', () => {
    expect(component.createBrandForm).toBeDefined();
    expect(component.createBrandForm.get('brandName')).toBeDefined();
    expect(component.createBrandForm.get('brandDescription')).toBeDefined();
  });

  it('should call loadBrands on ngOnInit', () => {
    jest.spyOn(component, 'loadBrands');
    component.ngOnInit();
    expect(component.loadBrands).toHaveBeenCalled();
  });

  describe('createBrand', () => {
    it('should not call createBrand if the form is invalid', () => {
      component.createBrandForm.patchValue({
        brandName: '',
        brandDescription: '',
      });
      component.createBrand();
      expect(brandService.createBrand).not.toHaveBeenCalled();
    });

    it('should call createBrand and show success toast on successful creation', () => {
      jest.spyOn(brandService, 'createBrand')
        .mockReturnValue(of(new HttpResponse<BrandResponse>({ status: 201 })));
      jest.spyOn(toastService, 'showToast');

      component.createBrandForm.setValue({
        brandName: "Valid Brand",
        brandDescription: "Valid Description",
      });

      component.createBrand();

      expect(brandService.createBrand).toHaveBeenCalledWith(
        component.createBrandForm.value
      );
      expect(toastService.showToast).toHaveBeenCalledWith(
        'Brand created successfully',
        ToastType.Success
      );
    });

    it('should show error toast when brand creation fails', () => {
      const mockError = { status: 400 };
      jest.spyOn(brandService, 'createBrand')
        .mockReturnValue(throwError(() => mockError));

      component.createBrandForm.patchValue({
        brandName: 'Test Brand',
        brandDescription: 'Test Description',
      });

      component.createBrand();

      expect(toastService.showToast).toHaveBeenCalledWith(
        'An error occurred while creating the brand.',
        ToastType.Error 
      );
    });
  });

  describe('loadBrands', () => {
    it('should load brands and update the component state', () => {
      const mockData = {
        content: [{ brandName: 'Brand 1', brandDescription: 'Description 1' }],
        totalElements: 1,
        totalPages: 1,
        currentPage: 0,
        isAscending: true,
      };
      jest.spyOn(brandService, 'getBrands').mockReturnValue(of(mockData));

      component.loadBrands();

      expect(brandService.getBrands).toHaveBeenCalledWith(
        0,
        5,
        'brandName',
        true
      );
      expect(component.brands).toEqual(mockData.content);
      expect(component.totalElements).toBe(mockData.totalElements);
      expect(component.totalPages).toBe(mockData.totalPages);
    });

    it('should show error toast if loading brands fails', () => {
      const mockError = { status: 500 };
      jest.spyOn(brandService, 'getBrands')
        .mockReturnValue(throwError(() => mockError));

      component.loadBrands();

      expect(toastService.showToast).toHaveBeenCalledWith(
        'Server error. Please try again later.',
        ToastType.Error 
      );
    });
  });

  describe('pagination and sorting', () => {
    it('should change page and reload brands', () => {
      jest.spyOn(component, 'loadBrands');

      component.changePage(1);

      expect(component.currentPage).toBe(1);
      expect(component.loadBrands).toHaveBeenCalledWith(
        1,
        component.pageSize,
        component.sortBy,
        component.isAscending
      );
    });

    describe('changeSortOrder', () => {
      it('should change sort order and reload brands', () => {
        jest.spyOn(component, 'loadBrands');

        component.changeSortOrder('brandName');

        expect(component.sortBy).toBe('brandName');
        expect(component.isAscending).toBe(false); 
        expect(component.loadBrands).toHaveBeenCalledWith(
          component.currentPage,
          component.pageSize,
          'brandName',
          false
        );
      });
    });

    describe('onRowsPerPageChange', () => {
      it('should change page size and reload brands', () => {
        jest.spyOn(component, 'loadBrands');

        component.onRowsPerPageChange(10);

        expect(component.pageSize).toBe(10);
        expect(component.loadBrands).toHaveBeenCalledWith(
          component.currentPage,
          10,
          component.sortBy,
          component.isAscending
        );
      });
    });

    describe('form validations', () => {
      it('should mark form as invalid if brand name is missing', () => {
        component.createBrandForm.patchValue({
          brandName: '',
          brandDescription: 'Valid Description',
        });

        expect(component.createBrandForm.invalid).toBeTruthy();
      });

      it('should mark form as valid if both fields are filled', () => {
        component.createBrandForm.patchValue({
          brandName: 'Valid Brand',
          brandDescription: 'Valid Description',
        });

        expect(component.createBrandForm.valid).toBeTruthy();
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
        expect(component.createBrandForm.pristine).toBeTruthy();
        expect(component.createBrandForm.untouched).toBeTruthy();
        expect(component.createBrandForm.value).toEqual({
          brandName: '',
          brandDescription: '',
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
        const control = component.createBrandForm.get('brandName');
        control?.setErrors({ required: true });
        control?.markAsTouched();

        const errorMessage = component.getErrorMessage(control, 'Brand Name');
        expect(errorMessage).toBe('Brand Name is required.');
      });

      it('should return an empty string if control is not touched', () => {
        const control = component.createBrandForm.get('brandName');
        control?.setErrors({ required: true });

        const errorMessage = component.getErrorMessage(control, 'Brand Name');
        expect(errorMessage).toBe('');
      });

      it('should return an empty string if control is valid', () => {
        const control = component.createBrandForm.get('brandName');
        control?.setValue('Valid Brand');

        const errorMessage = component.getErrorMessage(control, 'Brand Name');
        expect(errorMessage).toBe('');
      });
    });
  });
});

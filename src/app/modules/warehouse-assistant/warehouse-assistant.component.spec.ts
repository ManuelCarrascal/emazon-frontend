import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { WarehouseAssistantComponent } from './warehouse-assistant.component';
import { WarehouseAssistantService } from '@/app/shared/services/warehouse-assistant/warehouse-assistant.service';
import { ToastService, ToastType } from '@/app/shared/services/toast/toast.service';
import { User } from '@/app/shared/interfaces/user.interface';
import { HttpResponse } from '@angular/common/http';
import { InputWithErrorComponent } from '@/app/ui/molecules/input-with-error/input-with-error.component'; // Import the component

describe('WarehouseAssistantComponent', () => {
  let component: WarehouseAssistantComponent;
  let fixture: ComponentFixture<WarehouseAssistantComponent>;
  let warehouseAssistantService: WarehouseAssistantService;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WarehouseAssistantComponent, InputWithErrorComponent], // Declare the component
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        WarehouseAssistantService,
        {
          provide: ToastService,
          useValue: {
            showToast: jest.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WarehouseAssistantComponent);
    component = fixture.componentInstance;
    warehouseAssistantService = TestBed.inject(WarehouseAssistantService);
    toastService = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.warehouseAssistantForm).toBeDefined();
    expect(component.warehouseAssistantForm.controls['userName']).toBeDefined();
    expect(component.warehouseAssistantForm.controls['userLastName']).toBeDefined();
    expect(component.warehouseAssistantForm.controls['userIdentityDocument']).toBeDefined();
    expect(component.warehouseAssistantForm.controls['userPhone']).toBeDefined();
    expect(component.warehouseAssistantForm.controls['userEmail']).toBeDefined();
    expect(component.warehouseAssistantForm.controls['userPassword']).toBeDefined();
    expect(component.warehouseAssistantForm.controls['userBirthdate']).toBeDefined();
  });

  it('should validate the form correctly', () => {
    const form = component.warehouseAssistantForm;
    form.controls['userName'].setValue('');
    form.controls['userLastName'].setValue('');
    form.controls['userIdentityDocument'].setValue('');
    form.controls['userPhone'].setValue('');
    form.controls['userEmail'].setValue('');
    form.controls['userPassword'].setValue('');
    form.controls['userBirthdate'].setValue('');

    expect(form.valid).toBeFalsy();

    form.controls['userName'].setValue('John');
    form.controls['userLastName'].setValue('Doe');
    form.controls['userIdentityDocument'].setValue('12345678');
    form.controls['userPhone'].setValue('+573142734677');
    form.controls['userEmail'].setValue('john.doe@example.com');
    form.controls['userPassword'].setValue('Password123!');
    form.controls['userBirthdate'].setValue('1990-01-01');

    expect(form.valid).toBeTruthy();
  });

  it('should show error messages for invalid fields', () => {
    const form = component.warehouseAssistantForm;
    form.controls['userName'].setValue('');
    form.controls['userLastName'].setValue('');
    form.controls['userIdentityDocument'].setValue('');
    form.controls['userPhone'].setValue('');
    form.controls['userEmail'].setValue('');
    form.controls['userPassword'].setValue('');
    form.controls['userBirthdate'].setValue('');

    form.markAllAsTouched();

    expect(component.userNameError).toBe('Name is required');
    expect(component.userLastNameError).toBe('Last name is required');
    expect(component.userIdentityDocumentError).toBe('Identity document is required');
    expect(component.userPhoneError).toBe('Phone number is required');
    expect(component.userEmailError).toBe('Email is required');
    expect(component.userPasswordError).toBe('Password is required');
    expect(component.userBirthdateError).toBe('Birthdate is required');
  });

  it('should show minlength error messages for fields', () => {
    const form = component.warehouseAssistantForm;
    form.controls['userName'].setValue('Jo');
    form.controls['userLastName'].setValue('Do');
    form.controls['userIdentityDocument'].setValue('1234567');
    form.controls['userPassword'].setValue('Pass123');

    form.markAllAsTouched();

    expect(component.userNameError).toBe('Name must be at least 3 characters long');
    expect(component.userLastNameError).toBe('Last name must be at least 3 characters long');
    expect(component.userIdentityDocumentError).toBe('Identity document must be at least 8 characters long');
    expect(component.userPasswordError).toBe('Password must be at least 8 characters long');
  });

  it('should show pattern error message for phone', () => {
    const form = component.warehouseAssistantForm;
    form.controls['userPhone'].setValue('123456');

    form.markAllAsTouched();

    expect(component.userPhoneError).toBe('Phone number must be in the format +573142734677');
  });

  it('should show email format error message', () => {
    const form = component.warehouseAssistantForm;
    form.controls['userEmail'].setValue('invalid-email');

    form.markAllAsTouched();

    expect(component.userEmailError).toBe('Invalid email format');
  });

  it('should show notAdult error message for birthdate', () => {
    const form = component.warehouseAssistantForm;
    form.controls['userBirthdate'].setValue('2020-01-01');

    form.markAllAsTouched();

    expect(component.userBirthdateError).toBe('User must be an adult');
  });

  it('should create a warehouse assistant when form is valid', () => {
    const mockUser: User = {
      userName: 'John',
      userLastName: 'Doe',
      userIdentityDocument: '12345678',
      userPhone: '+573142734677',
      userEmail: 'john.doe@example.com',
      userPassword: 'Password123!',
      userBirthdate: '1989-10-10',
    };
  
    const formattedMockUser: User = {
      ...mockUser,
      userBirthdate: '09/10/1989', 
    };
  
    const mockResponse = {
      body: {
        userId: 1,
        ...formattedMockUser,
      },
    };
  
    jest.spyOn(warehouseAssistantService, 'registerAssistant').mockReturnValue(of(new HttpResponse({ body: mockResponse.body })));
  
    component.warehouseAssistantForm.setValue(mockUser);
    component.onSubmit();
  
    expect(toastService.showToast).toHaveBeenCalledWith('Warehouse assistant registered successfully', ToastType.Success);
    expect(warehouseAssistantService.registerAssistant).toHaveBeenCalledWith(formattedMockUser);
  });

  it('should show error message when registration fails', () => {
    const mockUser: User = {
      userName: 'John',
      userLastName: 'Doe',
      userIdentityDocument: '12345678',
      userPhone: '+573142734677',
      userEmail: 'john.doe@example.com',
      userPassword: 'Password123!',
      userBirthdate: '1990-01-01',
    };

    const mockError = {
      status: 400,
      error: { message: 'User must be an adult' },
    };

    jest.spyOn(warehouseAssistantService, 'registerAssistant').mockReturnValue(throwError(() => mockError));

    component.warehouseAssistantForm.setValue(mockUser);
    component.onSubmit();

    expect(toastService.showToast).toHaveBeenCalledWith('Failed to register warehouse assistant', ToastType.Error);
  });

  it('should restrict phone input to only allow + and digits', () => {
    const event = {
      target: { value: 'abc+1234567890' },
    } as unknown as Event;

    component.restrictPhoneInput(event);

    expect((event.target as HTMLInputElement)?.value).toBe('+1234567890');
  });
});
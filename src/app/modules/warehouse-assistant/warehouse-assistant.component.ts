import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ToastService, ToastType } from '@/app/shared/services/toast/toast.service';
import { User } from '@/app/shared/interfaces/user.interface';
import { WarehouseAssistantService } from '@/app/shared/services/warehouse-assistant/warehouse-assistant.service';

@Component({
  selector: 'app-warehouse-assistant',
  templateUrl: './warehouse-assistant.component.html',
  styleUrls: ['./warehouse-assistant.component.scss']
})
export class WarehouseAssistantComponent implements OnInit {
  public warehouseAssistantForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly warehouseAssistantService: WarehouseAssistantService,
    private readonly toastService: ToastService
  ) {
    this.warehouseAssistantForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      userLastName: ['', [Validators.required, Validators.minLength(3)]],
      userIdentityDocument: ['', [Validators.required, Validators.minLength(8)]],
      userPhone: ['', [Validators.required, Validators.minLength(9)]],
      userEmail: ['', [Validators.required, Validators.email]],
      userPassword: ['', [Validators.required, Validators.minLength(8)]],
      userBirthdate: ['', [Validators.required]], 
    });
  }

  ngOnInit(): void {}

  get userName(): AbstractControl | null {
    return this.warehouseAssistantForm.get('userName');
  }

  get userLastName(): AbstractControl | null {
    return this.warehouseAssistantForm.get('userLastName');
  }

  get userIdentityDocument(): AbstractControl | null {
    return this.warehouseAssistantForm.get('userIdentityDocument');
  }

  get userPhone(): AbstractControl | null {
    return this.warehouseAssistantForm.get('userPhone');
  }

  get userEmail(): AbstractControl | null {
    return this.warehouseAssistantForm.get('userEmail');
  }

  get userPassword(): AbstractControl | null {
    return this.warehouseAssistantForm.get('userPassword');
  }

  get userBirthdate(): AbstractControl | null { 
    return this.warehouseAssistantForm.get('userBirthdate');
  }

  get userNameError(): string {
    const control = this.userName;
    if (control?.touched && control?.errors) {
      if (control.errors['required']) {
        return 'Name is required';
      }
      if (control.errors['minlength']) {
        return `Name must be at least ${control.errors['minlength'].requiredLength} characters long`;
      }
    }
    return '';
  }

  get userLastNameError(): string {
    const control = this.userLastName;
    if (control?.touched && control?.errors) {
      if (control.errors['required']) {
        return 'Last name is required';
      }
      if (control.errors['minlength']) {
        return `Last name must be at least ${control.errors['minlength'].requiredLength} characters long`;
      }
    }
    return '';
  }

  get userIdentityDocumentError(): string {
    const control = this.userIdentityDocument;
    if (control?.touched && control?.errors) {
      if (control.errors['required']) {
        return 'Identity document is required';
      }
      if (control.errors['minlength']) {
        return `Identity document must be at least ${control.errors['minlength'].requiredLength} characters long`;
      }
    }
    return '';
  }

  get userPhoneError(): string {
    const control = this.userPhone;
    if (control?.touched && control?.errors) {
      if (control.errors['required']) {
        return 'Phone number is required';
      }
      if (control.errors['minlength']) {
        return `Phone number must be at least ${control.errors['minlength'].requiredLength} characters long`;
      }
    }
    return '';
  }

  get userEmailError(): string {
    const control = this.userEmail;
    if (control?.touched && control?.errors) {
      if (control.errors['required']) {
        return 'Email is required';
      }
      if (control.errors['email']) {
        return 'Invalid email format';
      }
    }
    return '';
  }

  get userPasswordError(): string {
    const control = this.userPassword;
    if (control?.touched && control?.errors) {
      if (control.errors['required']) {
        return 'Password is required';
      }
      if (control.errors['minlength']) {
        return `Password must be at least ${control.errors['minlength'].requiredLength} characters long`;
      }
    }
    return '';
  }

  get userBirthdateError(): string { 
    const control = this.userBirthdate;
    if (control?.touched && control?.errors) {
      if (control.errors['required']) {
        return 'Birthdate is required';
      }
    }
    return '';
  }

  onSubmit(): void {
    if (this.warehouseAssistantForm.invalid) {
      this.warehouseAssistantForm.markAllAsTouched();
      return;
    }

    const assistant: User = this.warehouseAssistantForm.value;
    assistant.userBirthdate = formatDate(assistant.userBirthdate); 
    console.log('Form submitted:', assistant);

    this.warehouseAssistantService.registerAssistant(assistant).subscribe({
      next: (response) => {
        console.log('Response from server:', response);
        this.toastService.showToast('Warehouse assistant registered successfully', ToastType.Success);
        this.warehouseAssistantForm.reset();
      },
      error: (error) => {
        console.error('Error from server:', error);
        this.toastService.showToast('Failed to register warehouse assistant', ToastType.Error);
      }
    });
  }
}

function formatDate(date: string): string {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}
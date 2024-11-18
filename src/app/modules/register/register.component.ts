import { CustomerService } from './../../shared/services/customer/customer.service';
import { User } from '@/app/shared/interfaces/user.interface';
import {
  ToastService,
  ToastType,
} from '@/app/shared/services/toast/toast.service';
import { adultValidator } from '@/app/shared/validators/adult-validator';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  public customerForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly toastService: ToastService,
    private readonly customerService: CustomerService,
    private readonly router: Router
  ) {
    this.customerForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      userLastName: ['', [Validators.required, Validators.minLength(3)]],
      userIdentityDocument: [
        '',
        [Validators.required, Validators.minLength(8)],
      ],
      userPhone: [
        '',
        [Validators.required, Validators.pattern(/^\+\d{1,3}\d{10}$/)],
      ],
      userEmail: ['', [Validators.required, Validators.email]],
      userPassword: ['', [Validators.required, Validators.minLength(8)]],
      userBirthdate: ['', [Validators.required, adultValidator()]],
    });
  }

  get userName(): AbstractControl | null {
    return this.customerForm.get('userName');
  }

  get userLastName(): AbstractControl | null {
    return this.customerForm.get('userLastName');
  }

  get userIdentityDocument(): AbstractControl | null {
    return this.customerForm.get('userIdentityDocument');
  }

  get userPhone(): AbstractControl | null {
    return this.customerForm.get('userPhone');
  }

  get userEmail(): AbstractControl | null {
    return this.customerForm.get('userEmail');
  }

  get userPassword(): AbstractControl | null {
    return this.customerForm.get('userPassword');
  }

  get userBirthdate(): AbstractControl | null {
    return this.customerForm.get('userBirthdate');
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
      if (control.errors['pattern']) {
        return 'Phone number must be in the format +573142734677';
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
      if (control.errors['notAdult']) {
        return 'User must be an adult';
      }
    }
    return '';
  }

  restrictPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^+\d]/g, '');
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    const customer: User = this.customerForm.value;
    customer.userBirthdate = formatDate(customer.userBirthdate);

    this.customerService.registerCustomer(customer).subscribe({
      next: () => {
        this.toastService.showToast(
          'Customer registered successfully',
          ToastType.Success
        );
        this.customerForm.reset();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.toastService.showToast(
          'Failed to register customer',
          ToastType.Error
        );
      },
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

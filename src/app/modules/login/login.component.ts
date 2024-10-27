import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      userEmail: ['', [Validators.required, Validators.email]],
      userPassword: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  get userEmail(): AbstractControl | null {
    return this.loginForm.get('userEmail');
  }

  get userPassword(): AbstractControl | null {
    return this.loginForm.get('userPassword');
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
     
    }
    return '';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    console.log('Form submitted:', this.loginForm.value);
    this.goToDashboard();
  }

  goToDashboard() {
    this.router.navigate(['/dashboard/home']);
  }
}
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '@/app/shared/services/auth/auth.service';
import { ToastService, ToastType } from '@/app/shared/services/toast/toast.service';
import { LoginComponent } from './login.component';
import { UiModule } from '@/app/ui/ui.module'; 

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let toastService: ToastService;
  let router: Router;

  beforeEach(async () => {
    const authServiceMock = {
      login: jest.fn()
    };
    const toastServiceMock = {
      showToast: jest.fn()
    };
    const routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, UiModule], // Importa el módulo de UI aquí
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
        { provide: Router, useValue: routerMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    toastService = TestBed.inject(ToastService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form validation', () => {
    it('should invalidate the form when empty', () => {
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('should validate userEmail field', () => {
      const emailControl = component.userEmail;
      emailControl?.setValue('');
      emailControl?.markAsTouched();
      fixture.detectChanges();
      expect(emailControl?.valid).toBeFalsy();
      expect(component.userEmailError).toBe('Email is required');

      emailControl?.setValue('invalidEmail');
      expect(emailControl?.valid).toBeFalsy();
      expect(component.userEmailError).toBe('Invalid email format');

      emailControl?.setValue('test@example.com');
      expect(emailControl?.valid).toBeTruthy();
      expect(component.userEmailError).toBe('');
    });

    it('should validate userPassword field', () => {
      const passwordControl = component.userPassword;
      passwordControl?.setValue('');
      passwordControl?.markAsTouched();
      fixture.detectChanges();
      expect(passwordControl?.valid).toBeFalsy();
      expect(component.userPasswordError).toBe('Password is required');

      passwordControl?.setValue('validPassword');
      expect(passwordControl?.valid).toBeTruthy();
      expect(component.userPasswordError).toBe('');
    });
  });

  describe('onSubmit', () => {
    it('should mark all controls as touched if form is invalid', () => {
      jest.spyOn(component.loginForm, 'markAllAsTouched');
      component.onSubmit();
      expect(component.loginForm.markAllAsTouched).toHaveBeenCalled();
    });

    it('should call authService.login and navigate on successful login', () => {
      const mockToken = 'mockToken';
      jest.spyOn(authService, 'login').mockReturnValue(of({ token: mockToken }));
      jest.spyOn(component, 'goToDashboard');
      component.loginForm.setValue({ userEmail: 'test@example.com', userPassword: 'password' });
      component.onSubmit();
      expect(authService.login).toHaveBeenCalledWith({
        userEmail: 'test@example.com',
        userPassword: 'password'
      });
      expect(component.goToDashboard).toHaveBeenCalled();
    });

    it('should show error toast on invalid credentials', () => {
      jest.spyOn(authService, 'login').mockReturnValue(of({ token: '' }));
      component.loginForm.setValue({ userEmail: 'test@example.com', userPassword: 'wrongPassword' });
      component.onSubmit();
      expect(toastService.showToast).toHaveBeenCalledWith('Invalid Credentials', ToastType.Error);
    });

    it('should show error toast if login throws error', () => {
      jest.spyOn(authService, 'login').mockReturnValue(throwError(() => new Error('Login error')));
      component.loginForm.setValue({ userEmail: 'test@example.com', userPassword: 'password' });
      component.onSubmit();
      expect(toastService.showToast).toHaveBeenCalledWith('Invalid Credentials', ToastType.Error);
    });
  });

  describe('goToDashboard', () => {
    it('should navigate to dashboard', () => {
      component.goToDashboard();
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/home']);
    });
  });
});
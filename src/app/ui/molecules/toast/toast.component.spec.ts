import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { ToastService, Toast, ToastType } from '@/app/shared/services/toast.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let toastServiceMock: any;
  let debugElement: DebugElement;

  beforeEach(async () => {
    toastServiceMock = {
      toastState: of({ message: 'Test Message', type: ToastType.Success }),
    };

    await TestBed.configureTestingModule({
      declarations: [ToastComponent],
      providers: [{ provide: ToastService, useValue: toastServiceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a toast message when state changes', () => {
    const toastElement = debugElement.query(By.css('.toast-message'));
    expect(toastElement.nativeElement.textContent).toContain('Test Message');
  });

  it('should hide toast message after duration', () => {
    jest.useFakeTimers();
    component.ngOnInit();
    expect(component.isVisible).toBe(true);

    jest.advanceTimersByTime(4000);
    fixture.detectChanges(); 
    expect(component.isVisible).toBe(false);
  });

  it('should display different types of toast messages', () => {
    const successToast: Toast = { message: 'Success Message', type: ToastType.Success };
    const errorToast: Toast = { message: 'Error Message', type: ToastType.Error };

    toastServiceMock.toastState = of(successToast);
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.message).toBe('Success Message');
    expect(component.type).toBe(ToastType.Success);

    toastServiceMock.toastState = of(errorToast);
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.message).toBe('Error Message');
    expect(component.type).toBe(ToastType.Error);
  });

  it('should handle subscription to toast state', () => {
    const toast: Toast = { message: 'Subscription Test', type: ToastType.Success };
    toastServiceMock.toastState = of(toast);

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.message).toBe('Subscription Test');
    expect(component.type).toBe(ToastType.Success);
    expect(component.isVisible).toBe(true);
  });
});
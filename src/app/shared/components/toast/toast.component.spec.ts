import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { ToastService, ToastType } from 'src/app/core/services/toast.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs';

jest.mock('../../../core/services/toast.service', () => ({
  ToastService: jest.fn().mockImplementation(() => ({
    showToast: jest.fn(),
    toastState: of({ message: 'Test Message', type: ToastType.Success }),
  })),
  ToastType: {
    Success: 'success',
    Error: 'error',
    Warning: 'warning',
  },
}));

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let toastServiceMock: any;
  let debugElement: DebugElement;

  beforeEach(async () => {
    toastServiceMock = new ToastService();

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
});

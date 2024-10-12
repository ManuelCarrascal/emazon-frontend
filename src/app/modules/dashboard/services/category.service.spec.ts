import { Toast, ToastService, ToastType } from '@/app/core/services/toast.service';
import { TestBed } from '@angular/core/testing';


describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService],
    });
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit a success toast message', (done) => {
    const testMessage = 'Success Message';
    const expectedToast: Toast = { message: testMessage, type: ToastType.Success };

    service.toastState.subscribe((toast) => {
      expect(toast).toEqual(expectedToast);
      done();
    });

    service.showToast(testMessage, ToastType.Success);
  });

  it('should emit an error toast message', (done) => {
    const testMessage = 'Error Message';
    const expectedToast: Toast = { message: testMessage, type: ToastType.Error };

    service.toastState.subscribe((toast) => {
      expect(toast).toEqual(expectedToast);
      done();
    });

    service.showToast(testMessage, ToastType.Error);
  });

  it('should emit a warning toast message', (done) => {
    const testMessage = 'Warning Message';
    const expectedToast: Toast = { message: testMessage, type: ToastType.Warning };

    service.toastState.subscribe((toast) => {
      expect(toast).toEqual(expectedToast);
      done();
    });

    service.showToast(testMessage, ToastType.Warning);
  });

  it('should emit a default success toast message when no type is provided', (done) => {
    const testMessage = 'Default Success Message';
    const expectedToast: Toast = { message: testMessage, type: ToastType.Success };

    service.toastState.subscribe((toast) => {
      expect(toast).toEqual(expectedToast);
      done();
    });

    service.showToast(testMessage);
  });
});
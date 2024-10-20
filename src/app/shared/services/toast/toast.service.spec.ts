import { TestBed } from '@angular/core/testing';
import { ToastService, ToastType } from './toast.service';

describe('ToastService', () => {
    let service: ToastService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToastService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should emit a success toast', (done) => {
        service.toastState.subscribe((toast) => {
            expect(toast.message).toBe('Success message');
            expect(toast.type).toBe(ToastType.Success);
            done();
        });
        service.showToast('Success message', ToastType.Success);
    });

    it('should emit an error toast', (done) => {
        service.toastState.subscribe((toast) => {
            expect(toast.message).toBe('Error message');
            expect(toast.type).toBe(ToastType.Error);
            done();
        });
        service.showToast('Error message', ToastType.Error);
    });

    it('should emit a warning toast', (done) => {
        service.toastState.subscribe((toast) => {
            expect(toast.message).toBe('Warning message');
            expect(toast.type).toBe(ToastType.Warning);
            done();
        });
        service.showToast('Warning message', ToastType.Warning);
    });

    it('should emit a default success toast when type is not provided', (done) => {
        service.toastState.subscribe((toast) => {
            expect(toast.message).toBe('Default success message');
            expect(toast.type).toBe(ToastType.Success);
            done();
        });
        service.showToast('Default success message');
    });
});
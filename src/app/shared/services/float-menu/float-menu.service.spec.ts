import { TestBed } from '@angular/core/testing';
import { FloatMenuService } from './float-menu.service';
import { take } from 'rxjs/operators';

describe('FloatMenuService', () => {
  let service: FloatMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FloatMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have isOpen$ as false initially', (done) => {
    service.isOpen$.pipe(take(1)).subscribe((isOpen) => {
      expect(isOpen).toBe(false);
      done();
    });
  });

  it('should set isOpen$ to true when openFloatMenu is called', (done) => {
    service.openFloatMenu();
    service.isOpen$.pipe(take(1)).subscribe((isOpen) => {
      expect(isOpen).toBe(true);
      done();
    });
  });

  it('should set isOpen$ to false when closeFloatMenu is called', (done) => {
    service.openFloatMenu(); 
    service.closeFloatMenu();
    service.isOpen$.pipe(take(1)).subscribe((isOpen) => {
      expect(isOpen).toBe(false);
      done();
    });
  });

  it('should toggle isOpen$ when toggleFloatMenu is called', (done) => {
    service.toggleFloatMenu(); 
    service.isOpen$.pipe(take(1)).subscribe((isOpen) => {
      expect(isOpen).toBe(true);
      service.toggleFloatMenu(); 
      service.isOpen$.pipe(take(1)).subscribe((isOpen) => {
        expect(isOpen).toBe(false);
        done();
      });
    });
  });
});
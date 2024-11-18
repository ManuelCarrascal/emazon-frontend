import { TestBed } from '@angular/core/testing';
import { LoaderService } from './loader.service';
import { take } from 'rxjs/operators';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have isLoading$ as false initially', (done) => {
    service.isLoading$.pipe(take(1)).subscribe((isLoading) => {
      expect(isLoading).toBe(false);
      done();
    });
  });

  it('should set isLoading$ to true when showLoader is called', (done) => {
    service.showLoader();
    service.isLoading$.pipe(take(1)).subscribe((isLoading) => {
      expect(isLoading).toBe(true);
      done();
    });
  });

  it('should set isLoading$ to false when hideLoader is called', (done) => {
    service.showLoader(); 
    service.hideLoader();
    service.isLoading$.pipe(take(1)).subscribe((isLoading) => {
      expect(isLoading).toBe(false);
      done();
    });
  });
});
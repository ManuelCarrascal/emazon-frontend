import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { SaleService } from './sale.service';
import { environment } from '@/environments/environment';

describe('SaleService', () => {
  let service: SaleService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SaleService]
    });
    service = TestBed.inject(SaleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call buyCart and return a success message', () => {
    const mockResponse = 'Purchase successful';
    const token = 'mock-token';
    localStorage.setItem('token', token);

    service.buyCart().subscribe(response => {
      expect(response).toBe(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.supply_service_url}/sale`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush(mockResponse, { status: 200, statusText: 'OK' });
  });

  it('should handle error when buyCart fails', () => {
    const mockError = 'Purchase failed';
    const token = 'mock-token';
    localStorage.setItem('token', token);

    service.buyCart().subscribe({
      next: () => fail('expected an error, not a success message'),
      error: error => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      }
    });

    const req = httpMock.expectOne(`${environment.supply_service_url}/sale`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush(mockError, { status: 500, statusText: 'Internal Server Error' });
  });
});
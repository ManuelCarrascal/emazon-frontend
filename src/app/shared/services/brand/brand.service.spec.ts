import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrandService } from './brand.service';
import { environment } from '@/environments/environment';
import { Brand, BrandResponse } from '../../interfaces/brand.interface';
import { HttpResponse } from '@angular/common/http';
import { Pagination } from '../../interfaces/category.interface';

describe('BrandService', () => {
  let service: BrandService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.stock_service_url}/brands`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BrandService],
    });
    service = TestBed.inject(BrandService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#createBrand', () => {
    it('should create a brand and return the response', () => {
      const brand: Brand = { brandName: 'Test Brand', brandDescription: 'Test Description' };
      const mockResponse = new HttpResponse<Brand>({ status: 201, body: brand });

      service.createBrand(brand).subscribe((response) => {
        expect(response.body).toEqual(brand);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${localStorage.getItem('token')}`);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.event(mockResponse);
    });

    it('should handle error response', () => {
      const brand: Brand = { brandName: 'Test Brand', brandDescription: 'Test Description' };
      service.createBrand(brand).subscribe({
        next: () => fail('expected an error, not brands'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(null, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('#getBrands', () => {
    it('should return a list of brands', () => {
      const mockResponse: Pagination<BrandResponse> = {
        content: [
          { brandId: 1, brandName: 'Brand 1', brandDescription: 'Description 1' },
          { brandId: 2, brandName: 'Brand 2', brandDescription: 'Description 2' },
        ],
        totalElements: 2,
        totalPages: 1,
        currentPage: 0,
        isAscending: false
      };

      const expectedResponse: Pagination<Brand> = {
        content: [
          { brandName: 'Brand 1', brandDescription: 'Description 1' },
          { brandName: 'Brand 2', brandDescription: 'Description 2' },
        ],
        totalElements: 2,
        totalPages: 1,
        currentPage: 0,
        isAscending: true,
      };

      service.getBrands(0, 10, 'brandName', true).subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

      const req = httpMock.expectOne((request) => {
        return (
          request.url === apiUrl &&
          request.params.get('page') === '0' &&
          request.params.get('size') === '10' &&
          request.params.get('sortBy') === 'brandName' &&
          request.params.get('isAscending') === 'true'
        );
      });

      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${localStorage.getItem('token')}`);
      req.flush(mockResponse);
    });

    it('should handle error response', () => {
      service.getBrands(0, 10, 'brandName', true).subscribe({
        next: () => fail('expected an error, not brands'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne((request) => {
        return (
          request.url === apiUrl &&
          request.params.get('page') === '0' &&
          request.params.get('size') === '10' &&
          request.params.get('sortBy') === 'brandName' &&
          request.params.get('isAscending') === 'true'
        );
      });
      req.flush(null, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('#getAllBrands', () => {
    it('should return a list of all brands', () => {
      const mockResponse: BrandResponse[] = [
        { brandId: 1, brandName: 'Brand 1', brandDescription: 'Description 1' },
        { brandId: 2, brandName: 'Brand 2', brandDescription: 'Description 2' },
      ];

      service.getAllBrands().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/all`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${localStorage.getItem('token')}`);
      req.flush(mockResponse);
    });

    it('should handle error response', () => {
      service.getAllBrands().subscribe({
        next: () => fail('expected an error, not brands'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/all`);
      req.flush(null, { status: 400, statusText: 'Bad Request' });
    });
  });
});
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product, ProductResponse } from '../../interfaces/product.interface';
import { environment } from '@/environments/environment';
import { HttpResponse } from '@angular/common/http';
import { Pagination } from '../../interfaces/category.interface';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#createProduct', () => {
    it('should create a product', () => {
      const dummyProduct: Product = {
        productName: 'Test Product',
        productDescription: 'Test Description',
        productQuantity: 10,
        productPrice: 100,
        brandId: 1,
        categoryIds: [1, 2],
      };

      const dummyProductResponse: ProductResponse = {
        productId: 1,
        productName: 'Test Product',
        productDescription: 'Test Description',
        productQuantity: 10,
        productPrice: 100,
        brand: { brandName: 'Test Brand' },
        categories: [
          { categoryId: 1, categoryName: 'Category 1' },
          { categoryId: 2, categoryName: 'Category 2' },
        ],
      };

      const dummyResponse = new HttpResponse({
        status: 201,
        body: dummyProductResponse,
      });

      service.createProduct(dummyProduct).subscribe((response) => {
        expect(response.status).toBe(201);
        expect(response.body).toEqual(dummyProductResponse);
      });

      const req = httpMock.expectOne(
        `${environment.stock_service_url}/products`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(
        `Bearer ${localStorage.getItem('token')}`
      );
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.event(dummyResponse);
    });

    it('should handle error response', () => {
      const dummyProduct: Product = {
        productName: 'Test Product',
        productDescription: 'Description',
        productQuantity: 10,
        productPrice: 100,
        brandId: 1,
        categoryIds: [1, 2],
      };

      service.createProduct(dummyProduct).subscribe({
        next: () => fail('should have failed with 500 status'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(
        `${environment.stock_service_url}/products`
      );
      expect(req.request.method).toBe('POST');
      req.flush('Internal Server Error', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });

    it('should set correct headers', () => {
      const dummyProduct: Product = {
        productName: 'Test Product',
        productDescription: 'Description',
        productQuantity: 10,
        productPrice: 100,
        brandId: 1,
        categoryIds: [1, 2],
      };

      service.createProduct(dummyProduct).subscribe();

      const req = httpMock.expectOne(
        `${environment.stock_service_url}/products`
      );
      expect(req.request.headers.get('Authorization')).toBe(
        `Bearer ${localStorage.getItem('token')}`
      );
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
    });
  });

  describe('#getProducts', () => {
    it('should return a list of products', () => {
      const mockResponse: Pagination<ProductResponse> = {
        content: [
          {
            productId: 1,
            productName: 'Product 1',
            productDescription: 'Description 1',
            productQuantity: 10,
            productPrice: 100,
            brand: { brandName: 'Brand 1' },
            categories: [
              { categoryId: 1, categoryName: 'Category 1' },
              { categoryId: 2, categoryName: 'Category 2' },
            ],
          },
          {
            productId: 2,
            productName: 'Product 2',
            productDescription: 'Description 2',
            productQuantity: 20,
            productPrice: 200,
            brand: { brandName: 'Brand 2' },
            categories: [
              { categoryId: 3, categoryName: 'Category 3' },
              { categoryId: 4, categoryName: 'Category 4' },
            ],
          },
        ],
        totalElements: 2,
        totalPages: 1,
        currentPage: 0,
        isAscending: true,
      };

      service.getProducts(0, 10, 'productName', true).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne((request) => {
        return (
          request.url === `${environment.stock_service_url}/products` &&
          request.params.get('page') === '0' &&
          request.params.get('size') === '10' &&
          request.params.get('sortBy') === 'productName' &&
          request.params.get('isAscending') === 'true'
        );
      });

      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(
        `Bearer ${localStorage.getItem('token')}`
      );
      req.flush(mockResponse);
    });

    it('should handle error response', () => {
      service.getProducts(0, 10, 'productName', true).subscribe({
        next: () => fail('expected an error, not products'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne((request) => {
        return (
          request.url === `${environment.stock_service_url}/products` &&
          request.params.get('page') === '0' &&
          request.params.get('size') === '10' &&
          request.params.get('sortBy') === 'productName' &&
          request.params.get('isAscending') === 'true'
        );
      });
      req.flush(null, { status: 400, statusText: 'Bad Request' });
    });
  });
});
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../../interfaces/product.interface';
import { environment } from '@/environments/environment';
import { HttpResponse } from '@angular/common/http'; 

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

  it('should create a product', () => {
    const dummyProduct: Product = {
      productName: 'Test Product',
      productDescription: 'Description',
      productCategories: [1, 2],
      productQuantity: 10,
      productPrice: 100,
      brandId: 1,
      categoryIds: [1, 2],
    };
    const dummyResponse = new HttpResponse({
      status: 201,
      body: dummyProduct,
    });

    service.createProduct(dummyProduct).subscribe((response) => {
      expect(response.status).toBe(201);
      expect(response.body).toEqual(dummyProduct);
    });

    const req = httpMock.expectOne(
      `${environment.stock_service_url}/products`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${environment.auth_token}`
    );
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.event(dummyResponse);
  });

  it('should handle error response', () => {
    const dummyProduct: Product = {
      productName: 'Test Product',
      productDescription: 'Description',
      productCategories: [1, 2],
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
      productCategories: [1, 2],
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
      `Bearer ${environment.auth_token}`
    );
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
  });
});
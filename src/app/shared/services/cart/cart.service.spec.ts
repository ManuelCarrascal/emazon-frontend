import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartService } from './cart.service';
import { environment } from '@/environments/environment';
import { CartResponse } from '@/app/shared/interfaces/cart.interface';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService],
    });
    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add product to cart', () => {
    const productId = 1;
    const quantity = 2;
    const token = 'test-token';
    localStorage.setItem('token', token);

    service.addProductToCart(productId, quantity).subscribe();

    const req = httpMock.expectOne(`${environment.cart_service_url}/add`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    expect(req.request.body).toEqual({ productId, quantity });
    req.flush({});
  });

  it('should get cart', () => {
    const size = 5;
    const page = 0;
    const isAscending = true;
    const cartResponse: CartResponse = {
      content: [],
      totalElements: 0,
      totalPages: 0,
      currentPage: 0,
      ascending: true,
      empty: true,
      total: 0,
    };
    const token = 'test-token';
    localStorage.setItem('token', token);

    service.getCart(size, page, isAscending).subscribe((response) => {
      expect(response).toEqual(cartResponse);
    });

    const req = httpMock.expectOne(
      `${environment.cart_service_url}?size=${size}&page=${page}&isAscending=${isAscending}`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush(cartResponse);
  });

  it('should get cart with category and brand', () => {
    const size = 5;
    const page = 0;
    const isAscending = true;
    const categoryName = 'Electronics';
    const brandName = 'BrandA';
    const cartResponse: CartResponse = {
      content: [],
      totalElements: 0,
      totalPages: 0,
      currentPage: 0,
      ascending: true,
      empty: true,
      total: 0,
    };
    const token = 'test-token';
    localStorage.setItem('token', token);

    service.getCart(size, page, isAscending, categoryName, brandName).subscribe((response) => {
      expect(response).toEqual(cartResponse);
    });

    const req = httpMock.expectOne(
      `${environment.cart_service_url}?size=${size}&page=${page}&isAscending=${isAscending}&categoryName=${categoryName}&brandName=${brandName}`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush(cartResponse);
  });

  it('should remove product from cart', () => {
    const productId = 1;
    const token = 'test-token';
    localStorage.setItem('token', token);

    service.removeProductFromCart(productId).subscribe((response) => {
      expect(response).toBe('Product removed');
    });

    const req = httpMock.expectOne(`${environment.cart_service_url}/delete/${productId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush('Product removed');
  });

  it('should get latest update', () => {
    const latestUpdate = '2023-01-01T00:00:00Z';
    const token = 'test-token';
    localStorage.setItem('token', token);

    service.getLatestUpdate().subscribe((response) => {
      expect(response).toBe(latestUpdate);
    });

    const req = httpMock.expectOne(`${environment.cart_service_url}/latest-update`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush(latestUpdate);
  });

  it('should update cart quantity', () => {
    const productId = 1;
    const quantity = 2;
    const token = 'test-token';
    localStorage.setItem('token', token);

    service.updateCartQuantity(productId, quantity).subscribe();

    const req = httpMock.expectOne(`${environment.cart_service_url}/update-quantity`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    expect(req.request.body).toEqual({ productId, quantity });
    req.flush({});
  });

  it('should handle error response for addProductToCart', () => {
    const productId = 1;
    const quantity = 2;
    const token = 'test-token';
    localStorage.setItem('token', token);

    service.addProductToCart(productId, quantity).subscribe({
      next: () => fail('expected an error, not a successful response'),
      error: (error) => {
        expect(error.status).toBe(400);
      },
    });

    const req = httpMock.expectOne(`${environment.cart_service_url}/add`);
    expect(req.request.method).toBe('POST');
    req.flush('Error', { status: 400, statusText: 'Bad Request' });
  });

  it('should handle error response for getCart', () => {
    const size = 5;
    const page = 0;
    const isAscending = true;
    const token = 'test-token';
    localStorage.setItem('token', token);

    service.getCart(size, page, isAscending).subscribe({
      next: () => fail('expected an error, not a successful response'),
      error: (error) => {
        expect(error.status).toBe(500);
      },
    });

    const req = httpMock.expectOne(
      `${environment.cart_service_url}?size=${size}&page=${page}&isAscending=${isAscending}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle error response for removeProductFromCart', () => {
    const productId = 1;
    const token = 'test-token';
    localStorage.setItem('token', token);

    service.removeProductFromCart(productId).subscribe({
      next: () => fail('expected an error, not a successful response'),
      error: (error) => {
        expect(error.status).toBe(404);
      },
    });

    const req = httpMock.expectOne(`${environment.cart_service_url}/delete/${productId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });

  it('should handle error response for getLatestUpdate', () => {
    const token = 'test-token';
    localStorage.setItem('token', token);

    service.getLatestUpdate().subscribe({
      next: () => fail('expected an error, not a successful response'),
      error: (error) => {
        expect(error.status).toBe(500);
      },
    });

    const req = httpMock.expectOne(`${environment.cart_service_url}/latest-update`);
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle error response for updateCartQuantity', () => {
    const productId = 1;
    const quantity = 2;
    const token = 'test-token';
    localStorage.setItem('token', token);

    service.updateCartQuantity(productId, quantity).subscribe({
      next: () => fail('expected an error, not a successful response'),
      error: (error) => {
        expect(error.status).toBe(400);
      },
    });

    const req = httpMock.expectOne(`${environment.cart_service_url}/update-quantity`);
    expect(req.request.method).toBe('PATCH');
    req.flush('Error', { status: 400, statusText: 'Bad Request' });
  });
});
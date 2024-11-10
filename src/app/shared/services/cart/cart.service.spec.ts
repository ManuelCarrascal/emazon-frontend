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
      providers: [CartService]
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

  it('should get token from localStorage', () => {
    const token = 'test-token';
    localStorage.setItem('token', token);
    expect(service['getToken']()).toBe(token);
  });

  it('should add product to cart', () => {
    const productId = 1;
    const quantity = 2;
    const token = 'test-token';
    localStorage.setItem('token', token);

    service.addProductToCart(productId, quantity).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.cart_service_url}/add`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    expect(req.request.body).toEqual({ productId, quantity });
    req.flush({ success: true });
  });

  it('should get cart', () => {
    const size = 5;
    const isAscending = true;
    const token = 'test-token';
    const mockCartResponse: CartResponse = {
      content: [],
      totalElements: 0,
      totalPages: 0,
      currentPage: 0,
      ascending: true,
      empty: true,
      total: 0
    };
    localStorage.setItem('token', token);

    service.getCart(size, isAscending).subscribe(response => {
      expect(response).toEqual(mockCartResponse);
    });

    const req = httpMock.expectOne(`${environment.cart_service_url}?size=${size}&isAscending=${isAscending}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush(mockCartResponse);
  });

  it('should remove product from cart', () => {
    const productId = 1;
    const token = 'test-token';
    localStorage.setItem('token', token);

    service.removeProductFromCart(productId).subscribe(response => {
      expect(response).toBe('Product removed');
    });

    const req = httpMock.expectOne(`${environment.cart_service_url}/delete/${productId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush('Product removed');
  });
});
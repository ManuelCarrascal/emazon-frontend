import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CartComponent } from './cart.component';
import { CartService } from '@/app/shared/services/cart/cart.service';
import { CartResponse, CartProduct } from '@/app/shared/interfaces/cart.interface';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartService: CartService;

  const mockCartProducts: CartProduct[] = [
    {
      productId: 1,
      productName: 'Product 1',
      productDescription: 'Description 1',
      productQuantity: 10,
      productPrice: 100,
      cartQuantity: 2,
      brand: {
        brandName: 'Brand 1',
        brandDescription: 'Description of Brand 1',
      },
      categories: [
        {
          categoryName: 'Category 1',
          categoryDescription: 'Description of Category 1',
        },
      ],
      subtotal: 200,
    },
    {
      productId: 2,
      productName: 'Product 2',
      productDescription: 'Description 2',
      productQuantity: 20,
      productPrice: 200,
      cartQuantity: 1,
      brand: {
        brandName: 'Brand 2',
        brandDescription: 'Description of Brand 2',
      },
      categories: [
        {
          categoryName: 'Category 2',
          categoryDescription: 'Description of Category 2',
        },
      ],
      subtotal: 200,
    },
  ];

  const mockCartResponse: CartResponse = {
    content: mockCartProducts,
    totalElements: 2,
    totalPages: 1,
    currentPage: 0,
    ascending: true,
    empty: false,
    total: 400,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartComponent],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: CartService,
          useValue: {
            getCart: jest.fn().mockReturnValue(of(mockCartResponse)),
            removeProductFromCart: jest.fn().mockReturnValue(of({})),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cart on init', () => {
    jest.spyOn(cartService, 'getCart').mockReturnValue(of(mockCartResponse));
    component.ngOnInit();
    expect(cartService.getCart).toHaveBeenCalledWith(component.size, true);
    expect(component.cartProducts).toEqual(mockCartResponse.content);
    expect(component.filteredProducts).toEqual(mockCartResponse.content);
    expect(component.total).toBe(mockCartResponse.total);
  });

  it('should update cart', () => {
    component.cartProducts = mockCartProducts;
    component.searchTerm = 'Product 1';
    component.updateCart();
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].productName).toBe('Product 1');
  });

  it('should remove product from cart', () => {
    jest.fn().mockReturnValue(of(''));
    component.cartProducts = mockCartProducts;
    component.filteredProducts = [...mockCartProducts];
    component.removeFromCart(1);
    expect(cartService.removeProductFromCart).toHaveBeenCalledWith(1);
    expect(component.cartProducts.length).toBe(1);
    expect(component.filteredProducts.length).toBe(1);
    expect(component.total).toBe(200);
  });

  it('should handle error when loading cart', () => {
    jest.spyOn(cartService, 'getCart').mockReturnValue(throwError(() => new Error('Error')));
    component.loadCart();
    expect(component.cartProducts).toEqual([]);
    expect(component.filteredProducts).toEqual([]);
    expect(component.total).toBe(0);
  });

  it('should handle error when removing product from cart', () => {
    jest
      .spyOn(cartService, 'removeProductFromCart')
      .mockReturnValue(throwError(() => new Error('Error')));
    component.cartProducts = mockCartProducts;
    component.filteredProducts = [...mockCartProducts];
    component.removeFromCart(1);
    expect(component.cartProducts.length).toBe(2);
    expect(component.filteredProducts.length).toBe(2);
    expect(component.total).toBe(400);
  });
});
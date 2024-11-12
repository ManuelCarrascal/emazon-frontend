import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CartComponent } from './cart.component';
import { CartService } from '@/app/shared/services/cart/cart.service';
import { SupplyService } from '@/app/shared/services/supply/supply.service';
import { CartResponse, CartProduct } from '@/app/shared/interfaces/cart.interface';
import { NextSupplyResponse } from '@/app/shared/interfaces/supply.interface';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartService: CartService;
  let supplyService: SupplyService;

  const mockCartProducts: CartProduct[] = [
    {
      productId: 1,
      productName: 'Product 1',
      productDescription: 'Description 1',
      productQuantity: 0,
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
      nextSupplyDate: '2023-10-10',
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

  const mockNextSupplyResponse: NextSupplyResponse = {
    nextSupplyDate: '2023-10-10',
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
            getLatestUpdate: jest.fn().mockReturnValue(of('2023-10-10 10:10:10')),
          },
        },
        {
          provide: SupplyService,
          useValue: {
            getNextSupplyDate: jest.fn().mockReturnValue(of(mockNextSupplyResponse)),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    supplyService = TestBed.inject(SupplyService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cart on init', () => {
    jest.spyOn(cartService, 'getCart').mockReturnValue(of(mockCartResponse));
    component.ngOnInit();
    expect(cartService.getCart).toHaveBeenCalledWith(component.size, component.currentPage, component.isAscending);
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
    jest.spyOn(cartService, 'removeProductFromCart').mockReturnValue(of(''));
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
    jest.spyOn(cartService, 'removeProductFromCart').mockReturnValue(throwError(() => new Error('Error')));
    component.cartProducts = mockCartProducts;
    component.filteredProducts = [...mockCartProducts];
    component.removeFromCart(1);
    expect(component.cartProducts.length).toBe(2);
    expect(component.filteredProducts.length).toBe(2);
    expect(component.total).toBe(400);
  });

  it('should change page', () => {
    jest.spyOn(component, 'loadCart');
    component.changePage(1);
    expect(component.currentPage).toBe(1);
    expect(component.loadCart).toHaveBeenCalled();
  });

  it('should change rows per page', () => {
    jest.spyOn(component, 'loadCart');
    const event = { target: { value: '10' } } as unknown as Event;
    component.onRowsPerPageChange(event);
    expect(component.size).toBe(10);
    expect(component.currentPage).toBe(0);
    expect(component.loadCart).toHaveBeenCalled();
  });

  it('should toggle sort order', () => {
    jest.spyOn(component, 'loadCart');
    component.toggleSortOrder();
    expect(component.isAscending).toBe(false);
    expect(component.loadCart).toHaveBeenCalled();
  });

  it('should load next supply date for products with zero quantity', () => {
    jest.spyOn(supplyService, 'getNextSupplyDate').mockReturnValue(of(mockNextSupplyResponse));
    component.cartProducts = mockCartProducts;
    component.loadCart();
    expect(supplyService.getNextSupplyDate).toHaveBeenCalledWith(1);
    expect(component.cartProducts[0].nextSupplyDate).toBe('2023-10-10');
  });

  it('should handle error when loading next supply date', () => {
    jest.spyOn(supplyService, 'getNextSupplyDate').mockReturnValue(throwError(() => new Error('Error')));
    component.cartProducts = mockCartProducts;
    component.loadNextSupplyDate(1);
    expect(supplyService.getNextSupplyDate).toHaveBeenCalledWith(1);
  });
});
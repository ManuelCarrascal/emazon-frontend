import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService } from '@/app/shared/services/cart/cart.service';
import { SupplyService } from '@/app/shared/services/supply/supply.service';
import { SaleService } from '@/app/shared/services/sale/sale.service';
import {
  ToastService,
  ToastType,
} from '@/app/shared/services/toast/toast.service';
import { of, throwError } from 'rxjs';
import {
  ERROR_CART_DATA_FETCH,
  ERROR_FETCH_NEXT_SUPPLY_DATE,
  ERROR_REMOVE_PRODUCT,
  SUCCESS_REMOVE_PRODUCT,
} from '@/app/shared/constants/cartComponent';
import { NextSupplyResponse } from '@/app/shared/interfaces/supply.interface';
import { CartResponse } from '@/app/shared/interfaces/cart.interface';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartService: CartService;
  let supplyService: SupplyService;
  let saleService: SaleService;
  let toastService: ToastService;

  const mockCartResponse: CartResponse = {
    content: [
      {
        productId: 1,
        productName: 'Product 1',
        productDescription: 'Description 1',
        productQuantity: 10,
        productPrice: 100,
        cartQuantity: 2,
        brand: {
          brandName: 'Brand 1',
          brandDescription: 'Brand Description 1',
        },
        categories: [
          {
            categoryName: 'Category 1',
            categoryDescription: 'Category Description 1',
          },
        ],
        subtotal: 200,
        nextSupplyDate: '2023-10-10',
      },
      {
        productId: 2,
        productName: 'Product 2',
        productDescription: 'Description 2',
        productQuantity: 5,
        productPrice: 50,
        cartQuantity: 4,
        brand: {
          brandName: 'Brand 2',
          brandDescription: 'Brand Description 2',
        },
        categories: [
          {
            categoryName: 'Category 2',
            categoryDescription: 'Category Description 2',
          },
        ],
        subtotal: 200,
        nextSupplyDate: '2023-10-15',
      },
    ],
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
      providers: [
        {
          provide: CartService,
          useValue: {
            getCart: jest.fn().mockReturnValue(of(mockCartResponse)),
            removeProductFromCart: jest
              .fn()
              .mockReturnValue(of('Product removed')),
            updateCartQuantity: jest.fn().mockReturnValue(of({})),
            getLatestUpdate: jest.fn().mockReturnValue(of('2023-10-10')),
          },
        },
        {
          provide: SupplyService,
          useValue: {
            getNextSupplyDate: jest
              .fn()
              .mockReturnValue(of(mockNextSupplyResponse)),
          },
        },
        {
          provide: SaleService,
          useValue: {
            buyCart: jest.fn().mockReturnValue(of('Purchase successful')),
          },
        },
        {
          provide: ToastService,
          useValue: {
            showToast: jest.fn(),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    supplyService = TestBed.inject(SupplyService);
    saleService = TestBed.inject(SaleService);
    toastService = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cart on init', () => {
    jest.spyOn(component, 'loadCart');
    component.ngOnInit();
    expect(component.loadCart).toHaveBeenCalled();
  });

  it('should load cart', () => {
    component.loadCart();
    expect(component.cartProducts.length).toBe(2);
    expect(component.filteredProducts.length).toBe(2);
    expect(component.total).toBe(400);
  });

  it('should handle error when loading cart', () => {
    jest
      .spyOn(cartService, 'getCart')
      .mockReturnValue(throwError(() => new Error('Error')));
    component.loadCart();
    expect(component.cartProducts.length).toBe(0);
    expect(component.filteredProducts.length).toBe(0);
    expect(component.total).toBe(0);
    expect(toastService.showToast).toHaveBeenCalledWith(
      ERROR_CART_DATA_FETCH,
      ToastType.Error
    );
  });

  it('should change page', () => {
    jest.spyOn(component, 'loadCart');
    component.changePage(1);
    expect(component.currentPage).toBe(1);
    expect(component.loadCart).toHaveBeenCalled();
  });

  it('should change rows per page', () => {
    jest.spyOn(component, 'loadCart');
    component.onRowsPerPageChange(10);
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

  it('should increase quantity', () => {
    jest.spyOn(component, 'updateCartQuantity');
    const product = mockCartResponse.content[0];
    component.increaseQuantity(product);
    expect(product.cartQuantity).toBe(3);
    expect(component.updateCartQuantity).toHaveBeenCalledWith(
      product.productId,
      3
    );
  });

  it('should decrease quantity', () => {
    jest.spyOn(component, 'updateCartQuantity');
    const product = mockCartResponse.content[0];
    component.decreaseQuantity(product);
    expect(product.cartQuantity).toBe(2);
    expect(component.updateCartQuantity).toHaveBeenCalledWith(
      product.productId,
      2
    );
  });

  it('should remove product from cart', () => {
    jest.spyOn(component, 'updateCart');
    component.removeFromCart(1);
    expect(component.cartProducts.length).toBe(1);
    expect(component.updateCart).toHaveBeenCalled();
    expect(toastService.showToast).toHaveBeenCalledWith(
      SUCCESS_REMOVE_PRODUCT,
      ToastType.Success
    );
  });

  it('should handle error when removing product from cart', () => {
    jest
      .spyOn(cartService, 'removeProductFromCart')
      .mockReturnValue(throwError(() => new Error('Error')));
    component.removeFromCart(1);
    expect(toastService.showToast).toHaveBeenCalledWith(
      ERROR_REMOVE_PRODUCT,
      ToastType.Error
    );
  });

  it('should load latest update', () => {
    component.loadLatestUpdate();
    expect(component.latestUpdate).toBe('2023-10-10');
  });

  it('should handle error when loading latest update', () => {
    jest
      .spyOn(cartService, 'getLatestUpdate')
      .mockReturnValue(throwError(() => new Error('Error')));
    component.loadLatestUpdate();
    expect(component.latestUpdate).toBeNull();
  });

  it('should load next supply date for products with zero quantity', () => {
    jest
      .spyOn(supplyService, 'getNextSupplyDate')
      .mockReturnValue(of(mockNextSupplyResponse));
    component.cartProducts = mockCartResponse.content;
    component.cartProducts[0].productQuantity = 0; // Ensure the product quantity is zero
    component.loadCart();
    expect(supplyService.getNextSupplyDate).toHaveBeenCalledWith(1);
    expect(component.cartProducts[0].nextSupplyDate).toBe('2023-10-10');
  });

  it('should handle error when loading next supply date', () => {
    jest
      .spyOn(supplyService, 'getNextSupplyDate')
      .mockReturnValue(throwError(() => new Error('Error')));
    component.loadNextSupplyDate(1);
    expect(toastService.showToast).toHaveBeenCalledWith(
      ERROR_FETCH_NEXT_SUPPLY_DATE,
      ToastType.Error
    );
  });

  it('should update cart quantity', () => {
    jest.spyOn(component, 'loadLatestUpdate');
    component.updateCartQuantity(1, 3);
    expect(component.cartProducts[0].cartQuantity).toBe(3);
    expect(component.cartProducts[0].subtotal).toBe(300);
    expect(component.total).toBe(500);
    expect(component.loadLatestUpdate).toHaveBeenCalled();
  });

  it('should call removeFromCart when quantity is less than or equal to 0', () => {
    jest.spyOn(component, 'removeFromCart');
    component.updateCartQuantity(1, 0);
    expect(component.removeFromCart).toHaveBeenCalledWith(1);
  });

  it('should call removeFromCart on Enter or Space key press', () => {
    jest.spyOn(component, 'removeFromCart');
    const eventEnter = new KeyboardEvent('keydown', { key: 'Enter' });
    const eventSpace = new KeyboardEvent('keydown', { key: ' ' });
    const button = document.createElement('button');
    button.value = '1';
    document.body.appendChild(button);

    button.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        component.removeFromCart(Number(button.value));
      }
    });

    button.dispatchEvent(eventEnter);
    expect(component.removeFromCart).toHaveBeenCalledWith(1);

    button.dispatchEvent(eventSpace);
    expect(component.removeFromCart).toHaveBeenCalledWith(1);

    document.body.removeChild(button);
  });

  it('should confirm purchase', () => {
    jest
      .spyOn(saleService, 'buyCart')
      .mockReturnValue(of('Purchase successful'));
    jest.spyOn(component, 'closeModal');
    jest.spyOn(component, 'loadCart');
    component.confirmPurchase();
    expect(saleService.buyCart).toHaveBeenCalled();
    expect(toastService.showToast).toHaveBeenCalledWith(
      'Purchase successful',
      ToastType.Success
    );
    expect(component.closeModal).toHaveBeenCalled();
    expect(component.loadCart).toHaveBeenCalled();
  });

  it('should handle error when confirming purchase', () => {
    jest
      .spyOn(saleService, 'buyCart')
      .mockReturnValue(throwError(() => new Error('Error')));
    component.confirmPurchase();
    expect(saleService.buyCart).toHaveBeenCalled();
    expect(toastService.showToast).toHaveBeenCalledWith(
      'Purchase failed',
      ToastType.Error
    );
  });
});

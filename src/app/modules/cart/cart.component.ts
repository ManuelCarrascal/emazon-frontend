import {
  ERROR_CART_DATA_FETCH,
  ERROR_FETCH_LAST_CART_UPDATE,
  ERROR_FETCH_NEXT_SUPPLY_DATE,
  ERROR_REMOVE_PRODUCT,
  SUCCESS_REMOVE_PRODUCT,
} from '@/app/shared/constants/cartComponent';
import {
  CartResponse,
  CartProduct,
} from '@/app/shared/interfaces/cart.interface';
import { NextSupplyResponse } from '@/app/shared/interfaces/supply.interface';
import { CartService } from '@/app/shared/services/cart/cart.service';
import { SaleService } from '@/app/shared/services/sale/sale.service';
import { SupplyService } from '@/app/shared/services/supply/supply.service';
import {
  ToastService,
  ToastType,
} from '@/app/shared/services/toast/toast.service';
import { Component, OnInit } from '@angular/core';

const DEFAULT_SIZE = 5;
const DEFAULT_PAGE = 0;
const DEFAULT_TOTAL = 0;
const DEFAULT_TOTAL_PAGES = 0;
const INITIAL_PAGE = 0;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartProducts: CartProduct[] = [];
  filteredProducts: CartProduct[] = [];
  total: number = DEFAULT_TOTAL;
  searchTerm: string = '';
  size: number = DEFAULT_SIZE;
  currentPage: number = DEFAULT_PAGE;
  totalPages: number = DEFAULT_TOTAL_PAGES;
  latestUpdate: string | null = null;
  isAscending: boolean = true;
  public isModalVisible: boolean = false;

  constructor(
    private readonly cartService: CartService,
    private readonly supplyService: SupplyService,
    private readonly toastService: ToastService,
    private readonly saleService: SaleService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService
      .getCart(this.size, this.currentPage, this.isAscending)
      .subscribe({
        next: (data: CartResponse) => {
          this.cartProducts = data.content;
          this.filteredProducts = [...this.cartProducts];
          this.total = data.total;
          this.totalPages = data.totalPages;

          if (this.cartProducts.length > 0) {
            this.loadLatestUpdate();
            this.cartProducts.forEach((product) => {
              if (product.productQuantity === 0) {
                this.loadNextSupplyDate(product.productId);
              }
            });
          }
        },
        error: () => {
          this.toastService.showToast(ERROR_CART_DATA_FETCH, ToastType.Error);
          this.cartProducts = [];
          this.filteredProducts = [];
          this.total = DEFAULT_TOTAL;
          this.totalPages = DEFAULT_TOTAL_PAGES;
        },
      });
  }

  loadLatestUpdate(): void {
    this.cartService.getLatestUpdate().subscribe({
      next: (data: string) => {
        this.latestUpdate = data;
      },
      error: (error) => {
        console.error(ERROR_FETCH_LAST_CART_UPDATE, error);
        this.latestUpdate = null;
      },
    });
  }

  updateCart(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.cartProducts.filter((product) => {
      const matchesCategory = product.categories?.some((category) =>
        category.categoryName.toLowerCase().includes(term)
      );
      const matchesBrand = product.brand?.brandName
        .toLowerCase()
        .includes(term);
      const matchesProductName = product.productName
        .toLowerCase()
        .includes(term);
      return matchesCategory || matchesBrand || matchesProductName;
    });
  }

  removeFromCart(productId: number): void {
    this.cartService.removeProductFromCart(productId).subscribe({
      next: () => {
        const removedProduct = this.cartProducts.find(
          (product) => product.productId === productId
        );
        if (removedProduct) {
          this.total -= removedProduct.subtotal;
        }
        this.cartProducts = this.cartProducts.filter(
          (product) => product.productId !== productId
        );
        this.updateCart();

        if (this.cartProducts.length > 0) {
          this.loadLatestUpdate();
        } else {
          this.latestUpdate = null;
        }

        if (this.currentPage > INITIAL_PAGE && this.cartProducts.length === 0) {
          this.currentPage--;
          this.loadCart();
        }

        this.toastService.showToast(SUCCESS_REMOVE_PRODUCT, ToastType.Success);
      },
      error: () => {
        this.toastService.showToast(ERROR_REMOVE_PRODUCT, ToastType.Error);
      },
    });
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadCart();
  }

  onRowsPerPageChange(newRowsPerPage: number): void {
    this.size = newRowsPerPage;
    this.currentPage = INITIAL_PAGE;
    this.loadCart();
  }

  toggleSortOrder(): void {
    this.isAscending = !this.isAscending;
    this.loadCart();
  }

  increaseQuantity(product: CartProduct): void {
    if (product.cartQuantity < product.productQuantity) {
      product.cartQuantity++;
      this.updateCartQuantity(product.productId, product.cartQuantity);
    }
  }

  decreaseQuantity(product: CartProduct): void {
    product.cartQuantity--;
    this.updateCartQuantity(product.productId, product.cartQuantity);
  }

  updateCartQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this.cartService.updateCartQuantity(productId, quantity).subscribe({
      next: () => {
        const product = this.cartProducts.find(
          (product) => product.productId === productId
        );
        if (product) {
          product.cartQuantity = quantity;
          product.subtotal = product.cartQuantity * product.productPrice;
          this.total = this.cartProducts.reduce(
            (acc, product) => acc + product.subtotal,
            0
          );
          this.loadLatestUpdate();
        }
      },
      error: (error) => {
        console.error('An error occurred:', error);
      },
    });
  }

  loadNextSupplyDate(productId: number): void {
    this.supplyService.getNextSupplyDate(productId).subscribe({
      next: (response: NextSupplyResponse) => {
        const product = this.cartProducts.find(
          (product) => product.productId === productId
        );
        if (product) {
          product.nextSupplyDate = response.nextSupplyDate;
        }
      },
      error: () => {
        this.toastService.showToast(
          ERROR_FETCH_NEXT_SUPPLY_DATE,
          ToastType.Error
        );
      },
    });
  }

  onKeyDownButton(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const target = event.target as HTMLElement;
      if (target) {
        target.click();
      }
    }
  }

  confirmPurchase(): void {
    this.saleService.buyCart().subscribe({
      next: (response) => {
        console.log('Purchase confirmed:', response);
        this.toastService.showToast('Purchase successful', ToastType.Success);
        this.closeModal();
        this.loadCart();
      },
      error: (error) => {
        console.error('Purchase failed:', error);
        this.toastService.showToast('Purchase failed', ToastType.Error);
      },
    });
  }
  cancelPurchase(): void {
    this.closeModal();
  }

  openModal(): void {
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
  }

  allProductsInStock(): boolean {
    return this.cartProducts.every(
      (product) =>
        product.cartQuantity <= product.productQuantity &&
        product.productQuantity > 0
    );
  }


}

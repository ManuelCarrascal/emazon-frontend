import {
  CartResponse,
  CartProduct,
} from '@/app/shared/interfaces/cart.interface';
import { CartService } from '@/app/shared/services/cart/cart.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartProducts: CartProduct[] = [];
  filteredProducts: CartProduct[] = [];
  total: number = 0;
  searchTerm: string = '';
  size: number = 5;
  currentPage: number = 0;
  totalPages: number = 0;
  latestUpdate: string | null = null;
  isAscending: boolean = true;

  constructor(private readonly cartService: CartService) {}

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
          console.log('Cart data:', data);

          if (this.cartProducts.length > 0) {
            this.loadLatestUpdate();
          }
        },
        error: (error) => {
          console.error('Error fetching cart data:', error);
          this.cartProducts = [];
          this.filteredProducts = [];
          this.total = 0;
          this.totalPages = 0;
        },
      });
  }

  loadLatestUpdate(): void {
    this.cartService.getLatestUpdate().subscribe({
      next: (data: string) => {
        this.latestUpdate = data;
      },
      error: (error) => {
        console.error('Error fetching latest update:', error);
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
    console.log(`Removing product with ID: ${productId}`);
    this.cartService.removeProductFromCart(productId).subscribe({
      next: () => {
        console.log('Product removed from cart');
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
      },
      error: (error) => {
        console.error('Error removing product from cart:', error);
      },
    });
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadCart();
  }

  onRowsPerPageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const rowsPerPage = Number(target.value);
    this.size = rowsPerPage;
    this.currentPage = 0;
    this.loadCart();
  }

  toggleSortOrder(): void {
    this.isAscending = !this.isAscending;
    this.loadCart();
  }
}

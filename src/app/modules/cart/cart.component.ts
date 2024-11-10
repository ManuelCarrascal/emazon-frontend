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

  constructor(private readonly cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    const isAscending = true;

    this.cartService.getCart(this.size, isAscending).subscribe({
      next: (data: CartResponse) => {
        this.cartProducts = data.content;
        this.filteredProducts = [...this.cartProducts];
        this.total = data.total;
        console.log('Cart data:', data);
      },
      error: (error) => {
        console.error('Error fetching cart data:', error);
        this.cartProducts = [];
        this.filteredProducts = [];
        this.total = 0;
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
    this.total = this.filteredProducts.reduce(
      (acc, product) => acc + product.subtotal,
      0
    );
  }

  removeFromCart(productId: number): void {
    console.log(`Removing product with ID: ${productId}`);
    this.cartService.removeProductFromCart(productId).subscribe({
      next: () => {
        console.log('Product removed from cart');
        this.cartProducts = this.cartProducts.filter(
          (product) => product.productId !== productId
        );
        this.filteredProducts = this.filteredProducts.filter(
          (product) => product.productId !== productId
        );
        this.total = this.filteredProducts.reduce(
          (acc, product) => acc + product.subtotal,
          0
        );
      },
      error: (error) => {
        console.error('Error removing product from cart:', error);
      },
    });
  }
}

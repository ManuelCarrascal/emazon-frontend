import { CartResponse, CartProduct } from '@/app/shared/interfaces/cart.interface';
import { CartService } from '@/app/shared/services/cart/cart.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartProducts: CartProduct[] = [];
  filteredProducts: CartProduct[] = [];
  total: number = 0;
  categoryName: string = '';
  brandName: string = '';

  constructor(private readonly cartService: CartService) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    const size = 5;
    const isAscending = true;

    this.cartService.getCart(size, isAscending).subscribe({
      next: (data: CartResponse) => {
        this.cartProducts = data.content;
        this.filteredProducts = [...this.cartProducts];
        this.total = this.cartProducts.reduce((acc, product) => acc + product.subtotal, 0); 
        console.log('Cart data:', data);
      },
      error: (error) => {
        console.error('Error fetching cart data:', error);
      }
    });
  }

  updateCart(): void {
    this.filteredProducts = this.cartProducts.filter(product => {
      const matchesCategory = !this.categoryName || (product.categories && product.categories.some(category => category.categoryName && category.categoryName.toLowerCase().includes(this.categoryName.toLowerCase())));
      const matchesBrand = !this.brandName || (product.brand && product.brand.brandName && product.brand.brandName.toLowerCase().includes(this.brandName.toLowerCase()));
      return matchesCategory && matchesBrand;
    });
    this.total = this.filteredProducts.reduce((acc, product) => acc + product.subtotal, 0);
  }

  removeFromCart(productId: number): void {
    console.log(`Removing product with ID: ${productId}`);
    this.cartService.removeProductFromCart(productId).subscribe({
      next: () => {
        console.log('Product removed from cart');
        this.cartProducts = this.cartProducts.filter(product => product.productId !== productId);
        this.filteredProducts = this.filteredProducts.filter(product => product.productId !== productId);
        this.total = this.filteredProducts.reduce((acc, product) => acc + product.subtotal, 0); 
      },
      error: (error) => {
        console.error('Error removing product from cart:', error);
      }
    });
  }
}
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
  total: number = 0;

  constructor(private readonly cartService: CartService) { }

  ngOnInit(): void {
    const size = 5;
    const isAscending = true;
    const categoryName = 'Electronics';

    this.cartService.getCart(size, isAscending, categoryName).subscribe({
      next: (data: CartResponse) => {
        this.cartProducts = data.content;
        this.total = data.total;
        console.log('Cart data:', data);
      },
      error: (error) => {
        console.error('Error fetching cart data:', error);
      }
    });
  }

  removeFromCart(productId: number): void {
    // Implementar la lógica para eliminar el producto del carrito
    console.log(`Removing product with ID: ${productId}`);
  }
}
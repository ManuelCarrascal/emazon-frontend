import { environment } from '@/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly apiUrl = `${environment.cart_service_url}/v1/cart/add`;

  constructor(private readonly http: HttpClient) {}

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  addProductToCart(productId: number, quantity: number) {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const body = {
      productId,
      quantity,
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
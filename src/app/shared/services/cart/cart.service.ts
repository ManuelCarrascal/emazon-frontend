import { environment } from '@/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagination } from '../../interfaces/category.interface';
import { ProductResponse } from '../../interfaces/product.interface';
import { CartResponse } from '../../interfaces/cart.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly apiUrl = environment.cart_service_url;

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

    return this.http.post(`${this.apiUrl}/add`, body, { headers });
  }

  getCart(size: number, isAscending: boolean, categoryName: string): Observable<CartResponse> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    let params = new HttpParams()
      .set('size', size.toString())
      .set('isAscending', isAscending.toString())
      .set('categoryName', categoryName);

    return this.http.get<CartResponse>(this.apiUrl, { headers, params });
  }
}
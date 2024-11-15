import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { CartResponse } from '@/app/shared/interfaces/cart.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly apiUrl = `${environment.cart_service_url}`;

  constructor(private readonly http: HttpClient) {}

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  addProductToCart(productId: number, quantity: number): Observable<any> {
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

  getCart(
    size: number,
    page: number,
    isAscending: boolean,
    categoryName?: string,
    brandName?: string
  ): Observable<CartResponse> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    let params = new HttpParams()
      .set('size', size.toString())
      .set('page', page.toString())
      .set('isAscending', isAscending.toString());

    if (categoryName) {
      params = params.set('categoryName', categoryName);
    }

    if (brandName) {
      params = params.set('brandName', brandName);
    }

    return this.http.get<CartResponse>(this.apiUrl, { headers, params });
  }

  removeProductFromCart(productId: number): Observable<string> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.delete(`${this.apiUrl}/delete/${productId}`, {
      headers,
      responseType: 'text',
    });
  }

  getLatestUpdate(): Observable<string> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/latest-update`, {
      headers,
      responseType: 'text',
    });
  }

  updateCartQuantity(productId: number, quantity: number): Observable<unknown> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const body = {
      productId,
      quantity,
    };

    return this.http.patch(`${this.apiUrl}/update-quantity`, body, { headers });
  }
}

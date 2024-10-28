import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Product, ProductResponse } from '../../interfaces/product.interface';
import { Pagination } from '../../interfaces/category.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiUrl = `${environment.stock_service_url}/products`;

  constructor(private readonly http: HttpClient) {}

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  createProduct(product: Product): Observable<HttpResponse<ProductResponse>> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<ProductResponse>(this.apiUrl, product, {
      headers,
      observe: 'response',
    });
  }

  getProducts(page: number, pageSize: number, sortBy: string, isAscending: boolean): Observable<Pagination<ProductResponse>> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString())
      .set('sortBy', sortBy)
      .set('isAscending', isAscending.toString());

    return this.http.get<Pagination<ProductResponse>>(this.apiUrl, { headers, params });
  }
}
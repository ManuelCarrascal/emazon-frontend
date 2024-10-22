import { environment } from '@/environments/environment';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductResponse } from '../../interfaces/product.interface';
import { Observable } from 'rxjs';
import { Pagination } from '../../interfaces/category.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiUrl = `${environment.stock_service_url}/products`;
  private readonly token = environment.auth_token;

  constructor(private readonly http: HttpClient) {}

  createProduct(product: ProductResponse): Observable<HttpResponse<ProductResponse>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<ProductResponse>(this.apiUrl, product, {
      headers,
      observe: 'response',
    });
  }

  getProducts(page: number, pageSize: number, sortBy: string, isAscending: boolean): Observable<Pagination<ProductResponse>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString())
      .set('sortBy', sortBy)
      .set('isAscending', isAscending.toString());

    return this.http.get<Pagination<ProductResponse>>(this.apiUrl, { headers, params });
  }
}
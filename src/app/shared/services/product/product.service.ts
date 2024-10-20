import { environment } from '@/environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiUrl = `${environment.stock_service_url}/products`;
  private readonly token = environment.auth_token;

  constructor(private readonly http: HttpClient) {}

  createProduct(product:Product):
  Observable<HttpResponse<Product>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    })

    return this.http.post<Product>(this.apiUrl,product,{
      headers,
      observe: 'response',
    })
  }
}

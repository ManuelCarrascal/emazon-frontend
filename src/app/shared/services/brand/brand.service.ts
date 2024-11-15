import { environment } from '@/environments/environment';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Brand, BrandResponse } from '../../interfaces/brand.interface';
import { Pagination } from '../../interfaces/category.interface';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private readonly apiUrl = `${environment.stock_service_url}/brands`;

  constructor(private readonly http: HttpClient) {}

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  createBrand(brand: Brand): Observable<HttpResponse<Brand>> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<Brand>(this.apiUrl, brand, {
      headers,
      observe: 'response',
    });
  }

  getBrands(
    page: number,
    size: number,
    sortBy: string,
    isAscending: boolean
  ): Observable<Pagination<Brand>> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('isAscending', isAscending.toString());

    return this.http
      .get<Pagination<BrandResponse>>(this.apiUrl, { headers, params })
      .pipe(
        map((response: Pagination<BrandResponse>) => ({
          ...response,
          content: response.content.map((brand) => ({
            brandName: brand.brandName,
            brandDescription: brand.brandDescription,
          })),
        }))
      );
  }

  getAllBrands(): Observable<BrandResponse[]> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<BrandResponse[]>(`${this.apiUrl}/all`, { headers });
  }
}

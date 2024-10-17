import { environment } from '@/environments/environment';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Brand, BrandResponse } from '../../interfaces/brand.interface';
import { Pagination } from '../../interfaces/category.interface';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private readonly apiUrl = `${environment.stock_service_url}/brands`;
  private readonly token = environment.auth_token;

  constructor(private readonly http: HttpClient) {}

  createBrand(brand: Brand): Observable<HttpResponse<Brand>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<Brand>(this.apiUrl, brand, {
      headers,
      observe: 'response',
    });
  }

  getBrands(page: number, size: number, sortBy: string, isAscending: boolean): Observable<Pagination<Brand>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('isAscending', isAscending.toString());

    return this.http.get<Pagination<BrandResponse>>(this.apiUrl, { headers, params }).pipe(
      map((response: Pagination<BrandResponse>) => ({
        ...response,
        content: response.content.map(brand => ({
          brandName: brand.brandName,
          brandDescription: brand.brandDescription,
        })),
      }))
    );
  }
}
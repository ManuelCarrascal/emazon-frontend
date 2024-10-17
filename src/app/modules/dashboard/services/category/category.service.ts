import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category, CategoryResponse, Pagination } from '../../interfaces/category.interface';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly apiUrl = `${environment.stock_service_url}/categories`;
  private readonly token = environment.auth_token;

  constructor(private readonly http: HttpClient) {}

  createCategory(category: Category): Observable<HttpResponse<Category>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<Category>(this.apiUrl, category, {
      headers,
      observe: 'response',
    });
  }

  getCategories(page: number, size: number, sortBy: string, isAscending: boolean): Observable<Pagination<Category>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('isAscending', isAscending.toString());

    return this.http.get<Pagination<CategoryResponse>>(this.apiUrl, { headers, params }).pipe(
      map((response: Pagination<CategoryResponse>) => ({
        ...response,
        content: response.content.map(category => ({
          categoryName: category.categoryName,
          categoryDescription: category.categoryDescription
        }))
      }))
    );
  }

  getAllCategories(): Observable<CategoryResponse[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.get<CategoryResponse[]>(`${this.apiUrl}/all`, { headers });
  }
}
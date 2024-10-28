import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category, CategoryResponse, Pagination } from '../../interfaces/category.interface';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly apiUrl = `${environment.stock_service_url}/categories`;

  constructor(private readonly http: HttpClient) {}

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  createCategory(category: Category): Observable<HttpResponse<{ categoryName: string; categoryDescription: string }>> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<Category>(this.apiUrl, category, {
      headers,
      observe: 'response',
    });
  }

  getCategories(page: number, size: number, sortBy: string, isAscending: boolean): Observable<Pagination<Category>> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
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
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<CategoryResponse[]>(`${this.apiUrl}/all`, { headers });
  }
}
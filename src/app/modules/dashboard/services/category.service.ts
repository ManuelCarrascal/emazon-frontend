import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../interfaces/category.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {
    private apiUrl = 'http://localhost:9091/categories';
  private token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImF1dGhvcml0aWVzIjoiUk9MRV9BRE1JTiIsInN1YiI6IjMiLCJpYXQiOjE3MjgxNzQ0NzgsImV4cCI6MTcyODIxMDQ3OH0.LGOsqR6zSA7aqoi-9Bb1MwrbuZ8MZGB2pNGftpBkn7g';

  constructor(private http: HttpClient) {}

  createCategory(category: Category): Observable<Category> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
    
    return this.http.post<Category>(this.apiUrl, category, { headers }); 
}
}

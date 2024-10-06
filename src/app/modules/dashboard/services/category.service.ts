import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../interfaces/category.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {
    private apiUrl = 'http://localhost:9091/categories';
  private token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImF1dGhvcml0aWVzIjoiUk9MRV9BRE1JTiIsInN1YiI6IjMiLCJpYXQiOjE3MjgyMjMzMTYsImV4cCI6MTcyODI1OTMxNn0.0H1tNIdm52hnvrfXyzLFe0AiJsPc6aJHuB9Hyl21b9c';

  constructor(private http: HttpClient) {}

  createCategory(category: Category): Observable<Category> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
    
    return this.http.post<Category>(this.apiUrl, category, { headers }); 
}
}

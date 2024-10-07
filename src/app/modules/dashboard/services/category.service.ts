import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../interfaces/category.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
    private apiUrl = environment.stock_service_url;
  private token =environment.auth_token;

  constructor(private http: HttpClient) {}

  createCategory(category: Category): Observable<Category> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
    
    return this.http.post<Category>(this.apiUrl, category, { headers }); 
}
}

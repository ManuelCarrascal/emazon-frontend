import { environment } from '@/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private readonly apiUrl = `${environment.supply_service_url}`;

  constructor(private readonly http:HttpClient) { }

  buyCart(): Observable<string> {
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/sale`, { headers, responseType: 'text' });
  }
}

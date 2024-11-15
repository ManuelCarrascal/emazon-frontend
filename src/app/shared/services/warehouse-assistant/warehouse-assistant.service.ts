import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserResponse } from '../../interfaces/user.interface';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WarehouseAssistantService {
  private readonly apiUrl = `${environment.user_service_url}/v1/users/warehouse-asst`;

  constructor(private readonly http: HttpClient) {}

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  registerAssistant(user: User): Observable<HttpResponse<UserResponse>> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<UserResponse>(this.apiUrl, user, {
      headers,
      observe: 'response',
    });
  }
}

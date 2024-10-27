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
  private readonly token = environment.auth_token;

  constructor(private readonly http: HttpClient) {}

  registerAssistant(user: User): Observable<HttpResponse<UserResponse>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<UserResponse>(this.apiUrl, user, {
      headers,
      observe: 'response',
    });
  }
}
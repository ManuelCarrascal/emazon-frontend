import { environment } from '@/environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserResponse } from '../../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly apiUrl = `${environment.user_service_url}/v1/users/register`;

  constructor(private readonly http: HttpClient) {}

  registerCustomer(user: User): Observable<HttpResponse<UserResponse>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<UserResponse>(this.apiUrl, user, {
      headers,
      observe: 'response',
    });
  }
}

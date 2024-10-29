import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { TokenPayload, UserLogin, UserLoginResponse } from '@/app/shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:9092/api/auth';
  private userRole: string | null = null;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  login(user: UserLogin): Observable<UserLoginResponse> {
    return this.http.post<UserLoginResponse>(`${this.apiUrl}/login`, user).pipe(
      tap((response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.userRole = this.decodeToken(response.token).authorities;
        }
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userRole = null;
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserRole(): string | null {
    if (!this.userRole) {
      const token = localStorage.getItem('token');
      if (token) {
        this.userRole = this.decodeToken(token).authorities;
      }
    }
    return this.userRole;
  }

  private decodeToken(token: string): TokenPayload {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }
}

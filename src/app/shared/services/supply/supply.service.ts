import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import {
  NextSupplyResponse,
  SupplyRequest,
  SupplyResponse,
} from '../../interfaces/supply.interface';

@Injectable({
  providedIn: 'root',
})
export class SupplyService {
  private readonly apiUrl = `${environment.supply_service_url}/supply`;

  constructor(private readonly http: HttpClient) {}

  addSupply(
    productId: number,
    supplyRequest: SupplyRequest
  ): Observable<SupplyResponse> {
    return this.http.post<SupplyResponse>(
      `${this.apiUrl}/add/${productId}`,
      supplyRequest
    );
  }
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  getNextSupplyDate(productId: number): Observable<NextSupplyResponse> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<NextSupplyResponse>(
      `${this.apiUrl}/get/next-supply-date/${productId}`,
      { headers }
    );
  }
}

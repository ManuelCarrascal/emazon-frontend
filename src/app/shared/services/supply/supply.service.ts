import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { SupplyRequest, SupplyResponse } from '../../interfaces/supply.interface';

@Injectable({
  providedIn: 'root'
})
export class SupplyService {
  private readonly apiUrl = `${environment.supply_service_url}/supply`;

  constructor(private readonly http: HttpClient) { }

  addSupply(productId: number, supplyRequest: SupplyRequest): Observable<SupplyResponse> {
    return this.http.post<SupplyResponse>(`${this.apiUrl}/add/${productId}`, supplyRequest);
  }
}
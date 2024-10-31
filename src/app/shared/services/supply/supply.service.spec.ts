import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SupplyService } from './supply.service';
import { environment } from '@/environments/environment';
import { SupplyRequest, SupplyResponse } from '../../interfaces/supply.interface';

describe('SupplyService', () => {
  let service: SupplyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SupplyService],
    });
    service = TestBed.inject(SupplyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#addSupply', () => {
    it('should add supply and return the response', () => {
      const productId = 1;
      const supplyRequest: SupplyRequest = {
        productQuantity: 10,
        nextSupplyDate: '2023-10-10',
      };

      const supplyResponse: SupplyResponse = {
        productId: 1,
        productQuantity: 10,
        nextSupplyDate: '2023-10-10',
      };

      service.addSupply(productId, supplyRequest).subscribe((response) => {
        expect(response).toEqual(supplyResponse);
      });

      const req = httpMock.expectOne(`${environment.supply_service_url}/supply/add/${productId}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(supplyRequest);
      req.flush(supplyResponse);
    });

    it('should handle error response', () => {
      const productId = 1;
      const supplyRequest: SupplyRequest = {
        productQuantity: 10,
        nextSupplyDate: '2023-10-10',
      };

      service.addSupply(productId, supplyRequest).subscribe({
        next: () => fail('expected an error, not a successful response'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${environment.supply_service_url}/supply/add/${productId}`);
      expect(req.request.method).toBe('POST');
      req.flush(null, { status: 400, statusText: 'Bad Request' });
    });
  });
});
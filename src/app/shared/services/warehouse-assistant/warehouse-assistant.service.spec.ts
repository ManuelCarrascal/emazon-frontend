import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WarehouseAssistantService } from './warehouse-assistant.service';
import { User, UserResponse } from '../../interfaces/user.interface';
import { environment } from '@/environments/environment';

describe('WarehouseAssistantService', () => {
  let service: WarehouseAssistantService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WarehouseAssistantService],
    });
    service = TestBed.inject(WarehouseAssistantService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register an assistant', () => {
    const mockUser: User = {
      userName: 'John',
      userLastName: 'Doe',
      userIdentityDocument: '12345678',
      userPhone: '+573142734677',
      userEmail: 'john.doe@example.com',
      userPassword: 'Password123!',
      userBirthdate: '1990-01-01',
    };

    const mockResponse: UserResponse = {
      userName: 'John',
      userLastName: 'Doe',
      userIdentityDocument: '12345678',
      userPhone: '+573142734677',
      userEmail: 'john.doe@example.com',
      userBirthdate: '1990-01-01',
    };

    service.registerAssistant(mockUser).subscribe((response) => {
      expect(response.body).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.user_service_url}/api/v1/users/warehouse-asst`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${environment.auth_token}`);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockResponse, { status: 201, statusText: 'Created' });
  });
});
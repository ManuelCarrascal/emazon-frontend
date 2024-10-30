import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '@/environments/environment';
import {
  UserLogin,
  UserLoginResponse,
} from '@/app/shared/interfaces/user.interface';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: Router, useValue: mockRouter }],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should store token and user role on successful login', () => {
      const mockResponse: UserLoginResponse = { token: 'fake-jwt-token' };
      const mockUser: UserLogin = {
        userEmail: 'test@example.com',
        userPassword: 'password',
      };

      service.login(mockUser).subscribe((response) => {
        expect(response.token).toBe(mockResponse.token);
        expect(localStorage.getItem('token')).toBe(mockResponse.token);
        expect(service.getUserRole()).toBe('ROLE_USER'); // Assuming the decoded token has 'ROLE_USER'
      });

      const req = httpMock.expectOne(
        `${environment.user_service_url}/auth/login`
      );
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle login error', () => {
      const mockUser: UserLogin = {
        userEmail: 'test@example.com',
        userPassword: 'password',
      };

      service.login(mockUser).subscribe((response) => {
        expect(response).toBeTruthy();
        expect(localStorage.getItem('token')).toBeNull();
      });

      const req = httpMock.expectOne(
        `${environment.user_service_url}/auth/login`
      );
      expect(req.request.method).toBe('POST');
      req.flush('Login error', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('should remove token and navigate to login', () => {
      localStorage.setItem('token', 'fake-jwt-token');
      service.logout();
      expect(localStorage.getItem('token')).toBeNull();
      expect(service.getUserRole()).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('isLoggedIn', () => {
    it('should return true if token exists', () => {
      localStorage.setItem('token', 'fake-jwt-token');
      expect(service.isLoggedIn()).toBe(true);
    });

    it('should return false if token does not exist', () => {
      localStorage.removeItem('token');
      expect(service.isLoggedIn()).toBe(false);
    });
  });

  describe('getUserRole', () => {
    const mockToken =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.' +
      'eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImF1dGhvcml0aWVzIjoiUk9MRV9BRE1JTiIsInN1YiI6IjMifQ.' +
      'xkrC68ie_kppIrWMhpvyuvpeoT2spQOeffAS3pi37j8';

    it('should return user role if token exists', () => {
      localStorage.setItem('token', mockToken);

      const role = service.getUserRole();

      expect(role).toBe('ROLE_ADMIN');
    });

    it('should return null if token does not exist', () => {
      localStorage.removeItem('token');
      expect(service.getUserRole()).toBeNull();
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '@/app/shared/services/auth/auth.service';
import { FloatMenuService } from '@/app/shared/services/float-menu/float-menu.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: jest.Mocked<AuthService>;
  let floatMenuService: jest.Mocked<FloatMenuService>;

  beforeEach(async () => {
    const authServiceMock = {
      logout: jest.fn(),
    };

    const floatMenuServiceMock = {
      toggleFloatMenu: jest.fn(),
      isOpen$: {
        subscribe: jest.fn(),
      },
    };

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: FloatMenuService, useValue: floatMenuServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    floatMenuService = TestBed.inject(FloatMenuService) as jest.Mocked<FloatMenuService>;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should call toggleFloatMenu on floatMenuService when toggleFloatMenu is called', () => {
    component.toggleFloatMenu();
    expect(floatMenuService.toggleFloatMenu).toHaveBeenCalled();
  });

  it('should call toggleFloatMenu on floatMenuService when Escape key is pressed', () => {
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    component.handleKeydown(event);
    expect(floatMenuService.toggleFloatMenu).toHaveBeenCalled();
  });

  it('should call logout on authService when logout is called', () => {
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
  });
});
import { TemplateRef, ViewContainerRef, Component } from '@angular/core';
import { RoleDirective } from './role.directive';
import { AuthService } from '@/app/shared/services/auth/auth.service';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <div *appRole="'ROLE_ADMIN'">Admin Content</div>
    <div *appRole="'ROLE_USER'">User Content</div>
  `
})
class TestComponent {}

describe('RoleDirective', () => {
  let authService: AuthService;

  beforeEach(() => {
    const authServiceMock = {
      getUserRole: jest.fn()
    };

    TestBed.configureTestingModule({
      declarations: [RoleDirective, TestComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: TemplateRef, useValue: {} },
        { provide: ViewContainerRef, useValue: { createEmbeddedView: jest.fn(), clear: jest.fn() } }
      ]
    });

    authService = TestBed.inject(AuthService);
  });

  it('should create an instance', () => {
    const templateRef = TestBed.inject(TemplateRef);
    const viewContainer = TestBed.inject(ViewContainerRef);
    const directive = new RoleDirective(templateRef, viewContainer, authService);
    expect(directive).toBeTruthy();
  });

  it('should display content for the correct role', () => {
    (authService.getUserRole as jest.Mock).mockReturnValue('ROLE_ADMIN');
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const adminContent = fixture.debugElement.queryAll(By.css('div'))[0];
    const userContent = fixture.debugElement.queryAll(By.css('div'))[1];

    expect(adminContent).toBeTruthy();
    expect(userContent).toBeFalsy();
  });

  it('should not display content for the incorrect role', () => {
    (authService.getUserRole as jest.Mock).mockReturnValue('ROLE_USER');
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const adminContent = fixture.debugElement.queryAll(By.css('div'))[0];
    const userContent = fixture.debugElement.queryAll(By.css('div'))[1];

    expect(adminContent).toBeTruthy();
    expect(userContent).toBeFalsy();
  });
});
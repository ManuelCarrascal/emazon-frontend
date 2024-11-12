import { Component } from '@angular/core';
import { AuthService } from '@/app/shared/services/auth/auth.service';
import { ROLES } from '../../constants/roles.constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public readonly ROLES = ROLES;

  constructor(private readonly authService: AuthService) {}


  logout(): void {
    this.authService.logout();
  }
}
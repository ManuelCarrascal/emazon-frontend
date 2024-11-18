import { Component } from '@angular/core';
import { AuthService } from '@/app/shared/services/auth/auth.service';
import { ROLES } from '../../constants/roles.constants';
import { FloatMenuService } from '@/app/shared/services/float-menu/float-menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public readonly ROLES = ROLES;

  constructor(
    private readonly authService: AuthService,
    public readonly floatMenuService: FloatMenuService
  ) {}

  toggleFloatMenu(): void {
    this.floatMenuService.toggleFloatMenu();
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.floatMenuService.toggleFloatMenu();
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
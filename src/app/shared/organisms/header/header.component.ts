import { Component } from '@angular/core';
import { AuthService } from '@/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private readonly authService: AuthService) {}


  logout(): void {
    this.authService.logout();
  }
}
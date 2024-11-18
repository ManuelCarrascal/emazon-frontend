import { Component } from '@angular/core';
import { FloatMenuService } from '@/app/shared/services/float-menu/float-menu.service';

@Component({
  selector: 'app-hamburger-button',
  templateUrl: './hamburger-button.component.html',
  styleUrls: ['./hamburger-button.component.scss'],
})
export class HamburgerButtonComponent {
  constructor(private readonly floatMenuService: FloatMenuService) {}

  toggleFloatMenu() {
    this.floatMenuService.toggleFloatMenu();
  }
}
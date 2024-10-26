import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavLinkComponent } from './atoms/nav-link/nav-link.component';
import { HeaderComponent } from './organisms/header/header.component';
import { UiModule } from '../ui/ui.module';
import { SidebarComponent } from './organisms/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { NavComponent } from './organisms/nav/nav.component';
import { FooterComponent } from './organisms/footer/footer.component';

@NgModule({
  declarations: [ NavLinkComponent,HeaderComponent, SidebarComponent, NavComponent, FooterComponent],
  imports: [
    CommonModule,
    UiModule,
    RouterModule
  ],
  exports: [NavLinkComponent, HeaderComponent, SidebarComponent, NavComponent, FooterComponent]
})
export class SharedModule { }

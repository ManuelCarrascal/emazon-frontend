import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardTemplateComponent } from './components/templates/dashboard-template/dashboard-template.component';
import { HeaderComponent } from './components/organisms/header/header.component';
import { LogoComponent } from './components/atoms/logo/logo.component';
import { HamburgerButtonComponent } from './components/atoms/hamburger-button/hamburger-button.component';
import { FooterComponent } from './components/organisms/footer/footer.component';
import { NavComponent } from './components/organisms/nav/nav.component';
import { NavLinkComponent } from './components/atoms/nav-link/nav-link.component';
import { DividerComponent } from './components/atoms/divider/divider.component';
import { InputsComponent } from './components/atoms/inputs/inputs.component';
import { CategoriesComponent } from './components/pages/categories/categories.component';

@NgModule({
  declarations: [
    DashboardTemplateComponent,
    HeaderComponent,
    LogoComponent,
    HamburgerButtonComponent,
    FooterComponent,
    NavComponent,
    NavLinkComponent,
    DividerComponent,
    InputsComponent,
    CategoriesComponent
   
  ],
  imports: [CommonModule, DashboardRoutingModule],
})
export class DashboardModule {}

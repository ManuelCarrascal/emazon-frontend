import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { LayoutComponent } from './components/templates/layout/layout.component';
import { LogoComponent } from './components/atoms/logo/logo.component';
import { HeaderComponent } from './components/organisms/header/header.component';
import { HamburgerButtonComponent } from './components/atoms/hamburger-button/hamburger-button.component';


@NgModule({
  declarations: [
    LayoutComponent,
    LogoComponent,
    HeaderComponent,
    HamburgerButtonComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }

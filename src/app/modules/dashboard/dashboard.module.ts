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
import { CategoriesComponent } from './components/pages/categories/categories.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  LucideAngularModule,
  ArrowDownAZ,
  ArrowUpAZ,
  MoveRight,
  MoveLeft,
} from 'lucide-angular';
import { DataTableComponent } from './components/organisms/data-table/data-table.component';
import { TableCellComponent } from './components/atoms/table-cell/table-cell.component';
import { SidebarComponent } from './components/organisms/sidebar/sidebar.component';
import { BrandsPageComponent } from './components/pages/brands-page/brands-page.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { ProductsPageComponent } from './components/pages/products-page/products-page.component';

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
    CategoriesComponent,
    DataTableComponent,
    TableCellComponent,
    SidebarComponent,
    BrandsPageComponent,
    HomePageComponent,
    ProductsPageComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    LucideAngularModule.pick({ ArrowDownAZ, ArrowUpAZ, MoveRight, MoveLeft }),
  ],
})
export class DashboardModule {}

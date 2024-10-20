import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardTemplateComponent } from './components/templates/dashboard-template/dashboard-template.component';
import { HeaderComponent } from './components/organisms/header/header.component';
import { FooterComponent } from './components/organisms/footer/footer.component';
import { NavComponent } from './components/organisms/nav/nav.component';
import { NavLinkComponent } from './components/atoms/nav-link/nav-link.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './components/organisms/sidebar/sidebar.component';
import { UiModule } from '@/app/ui/ui.module';
import {
  LucideAngularModule,
  ArrowDownAZ,
  ArrowUpAZ,
  MoveRight,
  MoveLeft,
  Search,
  X 
} from 'lucide-angular';

@NgModule({
  declarations: [
    DashboardTemplateComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    NavLinkComponent,
    SidebarComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    UiModule,
    LucideAngularModule.pick({ ArrowDownAZ, ArrowUpAZ, MoveRight, MoveLeft,Search,X  }),
  ],
  exports: [DashboardTemplateComponent],
})
export class DashboardModule {}

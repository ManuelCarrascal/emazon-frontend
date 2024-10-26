import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardTemplateComponent } from '../../ui/templates/dashboard-template/dashboard-template.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  ArrowDownAZ,
  ArrowUpAZ,
  MoveRight,
  MoveLeft,
  Search,
  X 
} from 'lucide-angular';
import { UiModule } from '@/app/ui/ui.module';
import { SharedModule } from '@/app/shared/shared.module';

@NgModule({
  declarations: [
    DashboardTemplateComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    UiModule,
    SharedModule,
    ReactiveFormsModule,
    LucideAngularModule.pick({ ArrowDownAZ, ArrowUpAZ, MoveRight, MoveLeft,Search,X  }),
  ],
  exports: [DashboardTemplateComponent],
})
export class DashboardModule {}

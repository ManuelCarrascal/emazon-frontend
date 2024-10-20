import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardTemplateComponent } from './components/templates/dashboard-template/dashboard-template.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardTemplateComponent,
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

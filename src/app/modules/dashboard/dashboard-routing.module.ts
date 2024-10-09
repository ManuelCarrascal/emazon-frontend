import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './components/pages/categories/categories.component';
import { DashboardTemplateComponent } from './components/templates/dashboard-template/dashboard-template.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardTemplateComponent,
    children: [
      { path: 'categories', component: CategoriesComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

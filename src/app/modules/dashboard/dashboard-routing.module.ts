import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './components/pages/categories/categories.component';
import { DashboardTemplateComponent } from './components/templates/dashboard-template/dashboard-template.component';
import { BrandsPageComponent } from './components/pages/brands-page/brands-page.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardTemplateComponent,
    children: [
      {path: 'home', component: HomePageComponent},
      { path: 'categories', component: CategoriesComponent },
      {path: 'brands', component: BrandsPageComponent}
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardTemplateComponent } from './modules/dashboard/components/templates/dashboard-template/dashboard-template.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'dashboard',
    component: DashboardTemplateComponent,
    children:[
       {
         path: '',
         loadChildren: () =>
           import('./modules/dashboard/dashboard.module').then(
             (m) => m.DashboardModule
           ),
       },
       {
        path: 'home',
        loadChildren: () =>
          import('./pages/home-page/home-page.module').then(
            (m) => m.HomePageModule
          ),
       },
      {
        path: 'categories',
        loadChildren: () =>
        import('./pages/category-page/category-page.module').then(
          (m) => m.CategoryPageModule
        ),
      },
      { 
        path: 'brands',
        loadChildren: ()=> import('./pages/brand-page/brand-page.module').then(
          (m) => m.BrandPageModule
        ),
      },
      {
        path: 'products',
        loadChildren: ()=> import( './pages/product-page/product-page.module').then(
          (m) => m.ProductPageModule
        ),
      }
    ]
   
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

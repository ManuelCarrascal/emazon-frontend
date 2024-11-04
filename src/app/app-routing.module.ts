import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardTemplateComponent } from './ui/templates/dashboard-template/dashboard-template.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginGuard } from './core/guards/login.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login-page/login-page.module').then(
        (m) => m.LoginPageModule
      ),
    canActivate: [LoginGuard],
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register-page/register-page.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'dashboard',
    component: DashboardTemplateComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/dashboard/home', pathMatch: 'full' },
      {
        path: '',
        loadChildren: () =>
          import('./pages/dashboard-page/dashboard.module').then(
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
        loadChildren: () =>
          import('./pages/brand-page/brand-page.module').then(
            (m) => m.BrandPageModule
          ),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./pages/product-page/product-page.module').then(
            (m) => m.ProductPageModule
          ),
      },
      {
        path: 'warehouse-assistant',
        loadChildren: () =>
          import(
            './pages/warehouse-assistant-page/warehouse-assistant-page.module'
          ).then((m) => m.WarehouseAssistantPageModule),
      },
    ],
  },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

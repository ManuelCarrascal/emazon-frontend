import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeModule } from '@/app/modules/home/home.module';
import { HomePageRoutingModule } from './home-page-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HomeModule,
    HomePageRoutingModule
  ]
})
export class HomePageModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandPageRoutingModule } from './brand-page-routing.module';
import { BrandModule } from '@/app/modules/brand/brand.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrandPageRoutingModule,
    BrandModule
  ]
})
export class BrandPageModule { }

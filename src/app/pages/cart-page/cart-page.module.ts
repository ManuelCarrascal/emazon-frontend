import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartPageRoutingModule } from './cart-page-routing.module';
import { CartModule } from '@/app/modules/cart/cart.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CartPageRoutingModule,
    CartModule
  ]
})
export class CartPageModule { }

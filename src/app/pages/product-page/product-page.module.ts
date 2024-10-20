import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductPageRoutingModule } from './product-page-routing.module';
import { ProductModule } from '@/app/modules/product/product.module';
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
  declarations: [],
  imports: [
    CommonModule,
    ProductPageRoutingModule,
    ProductModule,
    LucideAngularModule.pick({ ArrowDownAZ, ArrowUpAZ, MoveRight, MoveLeft,Search,X  }),
  ]
})
export class ProductPageModule { }

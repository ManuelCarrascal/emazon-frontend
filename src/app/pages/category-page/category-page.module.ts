import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryPageRoutingModule } from './category-page-routing.module';
import { CategoryModule } from '@/app/modules/category/category.module';
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
    CategoryPageRoutingModule,
    CategoryModule,
    LucideAngularModule.pick({ ArrowDownAZ, ArrowUpAZ, MoveRight, MoveLeft,Search,X  }),

  ]
})
export class CategoryPageModule { }

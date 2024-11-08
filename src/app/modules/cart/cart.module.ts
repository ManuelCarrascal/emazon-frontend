import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart.component';
import { SharedModule } from '@/app/shared/shared.module';
import { LucideAngularModule} from 'lucide-angular';



@NgModule({
  declarations: [CartComponent],
  imports: [
    CommonModule,
    SharedModule,
    LucideAngularModule
  ]
})
export class CartModule { }

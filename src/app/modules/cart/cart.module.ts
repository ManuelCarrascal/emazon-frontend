import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart.component';
import { SharedModule } from '@/app/shared/shared.module';
import { LucideAngularModule} from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { AtomsModule } from "../../ui/atoms/atoms.module";



@NgModule({
  declarations: [CartComponent],
  imports: [
    CommonModule,
    SharedModule,
    LucideAngularModule,
    FormsModule,
    AtomsModule
]
})
export class CartModule { }

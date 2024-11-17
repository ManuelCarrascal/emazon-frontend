import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart.component';
import { SharedModule } from '@/app/shared/shared.module';
import { LucideAngularModule ,Trash } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { AtomsModule } from '../../ui/atoms/atoms.module';
import { UiModule } from '@/app/ui/ui.module';

@NgModule({
  declarations: [CartComponent],
  imports: [
    CommonModule,
    SharedModule,
    LucideAngularModule.pick({ Trash}),
    FormsModule,
    AtomsModule,
    UiModule,
  ],
})
export class CartModule {}

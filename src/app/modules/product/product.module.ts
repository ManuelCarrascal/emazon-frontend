import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UiModule } from '@/app/ui/ui.module';
import { LucideAngularModule, X } from 'lucide-angular';

@NgModule({
  declarations: [ProductComponent],
  imports: [
    CommonModule,
    UiModule,
    ReactiveFormsModule,
    LucideAngularModule.pick({ X }),
  ],
  exports: [ProductComponent]
})
export class ProductModule { }

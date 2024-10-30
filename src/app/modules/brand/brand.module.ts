import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UiModule } from '@/app/ui/ui.module';
import { BrandComponent } from './brand.component';
import { SharedModule } from '@/app/shared/shared.module';

@NgModule({
  declarations: [BrandComponent],
  imports: [
    CommonModule,
    UiModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [BrandComponent]
})
export class BrandModule { }

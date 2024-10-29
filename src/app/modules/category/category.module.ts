import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories.component';
import { UiModule } from '@/app/ui/ui.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@/app/shared/shared.module';


@NgModule({
  declarations: [CategoriesComponent],
  imports: [
    CommonModule,
    UiModule,
    ReactiveFormsModule,
    SharedModule

  ],
  exports: [CategoriesComponent]
})
export class CategoryModule { }

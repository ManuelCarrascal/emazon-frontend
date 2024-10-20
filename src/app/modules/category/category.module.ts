import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories.component';
import { UiModule } from '@/app/ui/ui.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [CategoriesComponent],
  imports: [
    CommonModule,
    UiModule,
    ReactiveFormsModule
  ],
  exports: [CategoriesComponent]
})
export class CategoryModule { }

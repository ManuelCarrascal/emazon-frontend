import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseAssistantComponent } from './warehouse-assistant.component';
import { UiModule } from '@/app/ui/ui.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [WarehouseAssistantComponent],
  imports: [
    CommonModule,
    UiModule,
    ReactiveFormsModule
  ],
  exports: [WarehouseAssistantComponent]
})
export class WarehouseAssistantModule { }

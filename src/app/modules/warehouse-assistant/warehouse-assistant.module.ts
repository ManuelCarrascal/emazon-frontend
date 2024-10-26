import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiModule } from '@/app/ui/ui.module';
import { ReactiveFormsModule } from '@angular/forms';
import { WarehouseAssistantComponent } from './warehouse-assistant.component';

@NgModule({
  declarations: [WarehouseAssistantComponent],
  imports: [CommonModule, UiModule, ReactiveFormsModule],
  exports: [WarehouseAssistantComponent],
})
export class WarehouseAssistantModule {}

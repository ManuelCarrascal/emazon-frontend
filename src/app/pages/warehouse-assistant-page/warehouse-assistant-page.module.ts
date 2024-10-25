import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarehouseAssistantPageRoutingModule } from './warehouse-assistant-page-routing.module';
import { WarehouseAssistantModule } from '@/app/modules/warehouse-assistant/warehouse-assistant.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    WarehouseAssistantPageRoutingModule,
    WarehouseAssistantModule
  ]
})
export class WarehouseAssistantPageModule { }

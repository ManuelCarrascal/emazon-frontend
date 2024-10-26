import { WarehouseAssistantComponent } from '@/app/modules/warehouse-assistant/warehouse-assistant.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'', component: WarehouseAssistantComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseAssistantPageRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterPageRoutingModule } from './register-page-routing.module';
import { RegisterModule } from '@/app/modules/register/register.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RegisterPageRoutingModule,
    RegisterModule
  ]
})
export class RegisterPageModule { }

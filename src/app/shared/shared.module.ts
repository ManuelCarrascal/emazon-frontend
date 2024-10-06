import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { ToastComponent } from './components/toast/toast.component';



@NgModule({
  declarations: [ButtonComponent, ToastComponent],
  imports: [
    CommonModule
  ],
  exports: [ButtonComponent, ToastComponent]
})
export class SharedModule { }

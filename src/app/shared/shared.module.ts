import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { ToastComponent } from './components/toast/toast.component';
import { InputWithErrorComponent } from './components/input-with-error/input-with-error.component';



@NgModule({
  declarations: [ButtonComponent, ToastComponent, InputWithErrorComponent],
  imports: [
    CommonModule
  ],
  exports: [ButtonComponent, ToastComponent]
})
export class SharedModule { }

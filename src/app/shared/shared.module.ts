import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/atoms/button/button.component';
import { ToastComponent } from './components/molecules/toast/toast.component';
import { ModalComponent } from './components/modal/modal.component';
import { LoaderComponent } from './components/atoms/loader/loader.component';
import { InputWithErrorComponent } from './components/molecules/input-with-error/input-with-error.component';
import { TextAreaWithErrorComponent } from './components/molecules/text-area-with-error/text-area-with-error.component';

@NgModule({
  declarations: [ButtonComponent, ToastComponent, InputWithErrorComponent, TextAreaWithErrorComponent, ModalComponent, LoaderComponent],
  imports: [
    CommonModule
  ],
  exports: [ButtonComponent, ToastComponent, InputWithErrorComponent, TextAreaWithErrorComponent, ModalComponent,LoaderComponent]
})
export class SharedModule { }

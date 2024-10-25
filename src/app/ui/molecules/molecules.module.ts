import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { AtomsModule } from '../atoms/atoms.module';
import { ToastComponent } from './toast/toast.component';
import { InputWithErrorComponent } from './input-with-error/input-with-error.component';
import { TextAreaWithErrorComponent } from './text-area-with-error/text-area-with-error.component';
import { DropdownSearchInputComponent } from './dropdown-search-input/dropdown-search-input.component';
import { LucideAngularModule, Search } from 'lucide-angular';
import { InputWithLabelComponent } from './input-with-label/input-with-label.component';


@NgModule({
  declarations: [
    ModalComponent,
    ToastComponent,
    InputWithErrorComponent,
    TextAreaWithErrorComponent,
    DropdownSearchInputComponent,
    InputWithLabelComponent,
  ],
  imports: [
    CommonModule,
    AtomsModule,
    LucideAngularModule.pick({ Search }),
  ],
  exports:[
    ModalComponent,
    ToastComponent,
    InputWithErrorComponent,
    TextAreaWithErrorComponent,
    DropdownSearchInputComponent,
    InputWithLabelComponent,
  ]
})
export class MoleculesModule { }

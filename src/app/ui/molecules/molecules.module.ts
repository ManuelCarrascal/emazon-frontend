import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { AtomsModule } from '../atoms/atoms.module';
import { ToastComponent } from './toast/toast.component';
import { InputWithErrorComponent } from './input-with-error/input-with-error.component';
import { TextAreaWithErrorComponent } from './text-area-with-error/text-area-with-error.component';
import { DropdownSearchInputComponent } from './dropdown-search-input/dropdown-search-input.component';
import { LucideAngularModule, Search } from 'lucide-angular';


@NgModule({
  declarations: [
    ModalComponent,
    ToastComponent,
    InputWithErrorComponent,
    TextAreaWithErrorComponent,
    DropdownSearchInputComponent,
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
  ]
})
export class MoleculesModule { }

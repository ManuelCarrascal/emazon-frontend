import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { AtomsModule } from '@/app/ui/atoms/atoms.module';
import { MoleculesModule } from '@/app/ui/molecules/molecules.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    AtomsModule,
    MoleculesModule,
    ReactiveFormsModule
  ],
  exports: [
    RegisterComponent
  ]
})
export class RegisterModule { }

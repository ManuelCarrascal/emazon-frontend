import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { AtomsModule } from "../../ui/atoms/atoms.module";
import { MoleculesModule } from "../../ui/molecules/molecules.module";
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, AtomsModule, MoleculesModule, ReactiveFormsModule],
  exports: [LoginComponent],
})
export class LoginModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { AtomsModule } from "../../ui/atoms/atoms.module";
import { MoleculesModule } from "../../ui/molecules/molecules.module";
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@/app/shared/shared.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, AtomsModule, MoleculesModule, ReactiveFormsModule,SharedModule],
  exports: [LoginComponent],
})
export class LoginModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from './data-table/data-table.component';
import { MoleculesModule } from '../molecules/molecules.module';
import { AtomsModule } from '../atoms/atoms.module';
import {
  LucideAngularModule,
  ArrowDownAZ,
  ArrowUpAZ,
  MoveRight,
  MoveLeft,
  Search,
  X 
} from 'lucide-angular';

@NgModule({
  declarations: [DataTableComponent],
  imports: [
    CommonModule,
    AtomsModule,
    MoleculesModule,
    LucideAngularModule.pick({ ArrowDownAZ, ArrowUpAZ, MoveRight, MoveLeft,Search,X  }),

  ],
  exports: [DataTableComponent]
})
export class OrganismsModule { }
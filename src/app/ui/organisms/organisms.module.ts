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
  X,
  PackagePlus,
} from 'lucide-angular';
import { SharedModule } from '@/app/shared/shared.module';

@NgModule({
  declarations: [DataTableComponent],
  imports: [
    CommonModule,
    AtomsModule,
    MoleculesModule,
    SharedModule,
    LucideAngularModule.pick({
      ArrowDownAZ,
      ArrowUpAZ,
      MoveRight,
      MoveLeft,
      Search,
      X,
      PackagePlus,
    }),
  ],
  exports: [DataTableComponent],
})
export class OrganismsModule {}

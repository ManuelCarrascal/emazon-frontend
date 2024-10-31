import { NgModule } from '@angular/core';
import { AtomsModule } from './atoms/atoms.module';
import { MoleculesModule } from './molecules/molecules.module';
import { OrganismsModule } from './organisms/organisms.module';

@NgModule({
  imports: [
    AtomsModule,
    MoleculesModule,
    OrganismsModule,
  ],
  exports: [
    AtomsModule,
    MoleculesModule,
    OrganismsModule,
  ],
})
export class UiModule {}

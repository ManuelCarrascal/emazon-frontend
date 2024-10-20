import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerComponent } from './divider/divider.component';
import { HamburgerButtonComponent } from './hamburger-button/hamburger-button.component';
import { ButtonComponent } from './button/button.component';
import { TableCellComponent } from './table-cell/table-cell.component';
import { LogoComponent } from './logo/logo.component';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [
    DividerComponent,
    HamburgerButtonComponent,
    ButtonComponent,
    TableCellComponent,
    LogoComponent,
    LoaderComponent,
  ],
  imports: [CommonModule],
  exports: [
    DividerComponent,
    HamburgerButtonComponent,
    ButtonComponent,
    TableCellComponent,
    LogoComponent,
    LoaderComponent
  ],
})
export class AtomsModule {}

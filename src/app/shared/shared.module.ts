import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { ToastComponent } from './components/molecules/table-row/toast/toast.component';
import { InputWithErrorComponent } from './components/input-with-error/input-with-error.component';
import { TextAreaWithErrorComponent } from './components/text-area-with-error/text-area-with-error.component';
import { ModalComponent } from './components/modal/modal.component';
import { TableHeaderComponent } from './components/atoms/table-header/table-header.component';
import { TableCellComponent } from './components/atoms/table-cell/table-cell.component';
import { TableRowComponent } from './components/molecules/table-row/table-row.component';
import { TableComponent } from './components/organisms/table/table.component';



@NgModule({
  declarations: [ButtonComponent, ToastComponent, InputWithErrorComponent, TextAreaWithErrorComponent, ModalComponent, TableHeaderComponent, TableCellComponent, TableRowComponent, TableComponent],
  imports: [
    CommonModule
  ],
  exports: [ButtonComponent, ToastComponent, InputWithErrorComponent, TextAreaWithErrorComponent, ModalComponent]
})
export class SharedModule { }

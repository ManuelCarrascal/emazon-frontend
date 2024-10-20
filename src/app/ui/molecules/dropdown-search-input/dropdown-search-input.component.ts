import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-dropdown-search-input',
  templateUrl: './dropdown-search-input.component.html',
  styleUrls: ['./dropdown-search-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DropdownSearchInputComponent,
      multi: true
    }
  ]
})
export class DropdownSearchInputComponent implements ControlValueAccessor {
  @Input() items: any[] = [];
  @Input() filteredItems: any[] = [];
  @Input() selectedItems: any[] = [];
  @Input() displayProperty: string = 'name';
  @Input() idProperty: string = 'id';
  @Input() maxSelection: number = 1;
  @Input() placeholder: string = 'Search'; // Nueva propiedad de entrada para el placeholder
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() filterItems = new EventEmitter<void>();
  @Output() selectItem = new EventEmitter<any>();
  @Output() removeItem = new EventEmitter<any>();

  public searchTerm: string = '';
  public activeDropdown: boolean = false;

  private onChange: (value: any[]) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any[]): void {
    this.selectedItems = this.items.filter(item => value.includes(item[this.idProperty]));
  }

  registerOnChange(fn: (value: any[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onSearchTermChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.searchTermChange.emit(this.searchTerm);
    this.activeDropdown = true;
  }

  onFilterItems() {
    this.filterItems.emit();
  }

  onSelectItem(item: any) {
    if (this.maxSelection === 1) {
      this.selectedItems = [item];
    } else if (!this.selectedItems.includes(item) && this.selectedItems.length < this.maxSelection) {
      this.selectedItems.push(item);
    }
    this.onChange(this.selectedItems.map(it => it[this.idProperty]));
    this.selectItem.emit(item);
    this.searchTerm = ''; 
    this.activeDropdown = false;
  }

  onRemoveItem(item: any) {
    this.selectedItems = this.selectedItems.filter(it => it !== item);
    this.onChange(this.selectedItems.map(it => it[this.idProperty]));
    this.removeItem.emit(item);
  }
}
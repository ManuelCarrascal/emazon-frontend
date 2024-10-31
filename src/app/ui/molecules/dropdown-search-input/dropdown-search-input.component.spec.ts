import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DropdownSearchInputComponent } from "./dropdown-search-input.component";
import { FormsModule } from "@angular/forms";
import { spyOn } from 'jest-mock';

describe('DropdownSearchInputComponent', () => {
  let component: DropdownSearchInputComponent;
  let fixture: ComponentFixture<DropdownSearchInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropdownSearchInputComponent],
      imports: [FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownSearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit searchTermChange and set activeDropdown to true on search term change', () => {
    spyOn(component.searchTermChange, 'emit');
    const event = { target: { value: 'test' } } as any;
    component.onSearchTermChange(event);
    expect(component.searchTerm).toBe('test');
    expect(component.searchTermChange.emit).toHaveBeenCalledWith('test');
    expect(component.activeDropdown).toBe(true);
  });

  it('should emit filterItems on filter items', () => {
    spyOn(component.filterItems, 'emit');
    component.onFilterItems();
    expect(component.filterItems.emit).toHaveBeenCalled();
  });

  it('should select item and emit selectItem when maxSelection is 1', () => {
    component.maxSelection = 1;
    const item = { id: 1, name: 'Item 1' };
    spyOn(component.selectItem, 'emit');
    component.onSelectItem(item);
    expect(component.selectedItems).toEqual([item]);
    expect(component.selectItem.emit).toHaveBeenCalledWith(item);
    expect(component.searchTerm).toBe('');
    expect(component.activeDropdown).toBe(false);
  });

  it('should select item and emit selectItem when maxSelection is greater than 1', () => {
    component.maxSelection = 2;
    const item1 = { id: 1, name: 'Item 1' };
    const item2 = { id: 2, name: 'Item 2' };
    spyOn(component.selectItem, 'emit');
    component.onSelectItem(item1);
    component.onSelectItem(item2);
    expect(component.selectedItems).toEqual([item1, item2]);
    expect(component.selectItem.emit).toHaveBeenCalledWith(item1);
    expect(component.selectItem.emit).toHaveBeenCalledWith(item2);
    expect(component.searchTerm).toBe('');
    expect(component.activeDropdown).toBe(false);
  });

  it('should remove item and emit removeItem', () => {
    const item = { id: 1, name: 'Item 1' };
    component.selectedItems = [item];
    spyOn(component.removeItem, 'emit');
    component.onRemoveItem(item);
    expect(component.selectedItems).toEqual([]);
    expect(component.removeItem.emit).toHaveBeenCalledWith(item);
  });

  it('should call onChange with correct values', () => {
    const item = { id: 1, name: 'Item 1' };
    component.items = [item];
    component.selectedItems = [item];
    spyOn(component, 'onChange');
    component.onSelectItem(item);
    expect(component.onChange).toHaveBeenCalledWith([1]);
  });
});
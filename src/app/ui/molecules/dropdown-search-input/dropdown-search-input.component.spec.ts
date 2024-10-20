import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DropdownSearchInputComponent } from './dropdown-search-input.component';
import { By } from '@angular/platform-browser';

describe('DropdownSearchInputComponent', () => {
  let component: DropdownSearchInputComponent;
  let fixture: ComponentFixture<DropdownSearchInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropdownSearchInputComponent],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownSearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should write value', () => {
    const items = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
    component.items = items;
    component.writeValue([1]);
    expect(component.selectedItems).toEqual([items[0]]);
  });

  it('should register onChange callback', () => {
    const fn = jest.fn();
    component.registerOnChange(fn);
    component.writeValue([1]); // Trigger onChange indirectly
    expect(fn).toHaveBeenCalledWith([1]);
  });

  it('should register onTouched callback', () => {
    const fn = jest.fn();
    component.registerOnTouched(fn);
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.dispatchEvent(new Event('blur')); // Trigger onTouched indirectly
    expect(fn).toHaveBeenCalled();
  });

  it('should emit searchTermChange on search term change', () => {
    jest.spyOn(component.searchTermChange, 'emit');
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    expect(component.searchTermChange.emit).toHaveBeenCalledWith('test');
  });

  it('should emit filterItems on filter items', () => {
    jest.spyOn(component.filterItems, 'emit');
    component.onFilterItems();
    expect(component.filterItems.emit).toHaveBeenCalled();
  });

  it('should select item and emit selectItem', () => {
    jest.spyOn(component.selectItem, 'emit');
    const item = { id: 1, name: 'Item 1' };
    component.onSelectItem(item);
    expect(component.selectedItems).toEqual([item]);
    expect(component.selectItem.emit).toHaveBeenCalledWith(item);
  });

  it('should remove item and emit removeItem', () => {
    jest.spyOn(component.removeItem, 'emit');
    const item = { id: 1, name: 'Item 1' };
    component.selectedItems = [item];
    component.onRemoveItem(item);
    expect(component.selectedItems).toEqual([]);
    expect(component.removeItem.emit).toHaveBeenCalledWith(item);
  });

  it('should handle max selection', () => {
    component.maxSelection = 2;
    const item1 = { id: 1, name: 'Item 1' };
    const item2 = { id: 2, name: 'Item 2' };
    component.onSelectItem(item1);
    component.onSelectItem(item2);
    expect(component.selectedItems).toEqual([item1, item2]);
  });

  it('should not select more than max selection', () => {
    component.maxSelection = 1;
    const item1 = { id: 1, name: 'Item 1' };
    const item2 = { id: 2, name: 'Item 2' };
    component.onSelectItem(item1);
    component.onSelectItem(item2);
    expect(component.selectedItems).toEqual([item1]);
  });
});
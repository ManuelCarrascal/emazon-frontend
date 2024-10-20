import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTableComponent } from './data-table.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { TableCellComponent } from '../../atoms/table-cell/table-cell.component';

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    component.data = [{ id: 1, name: 'Test' }];
    component.columns = [{ key: 'name', label: 'Name', sortable: true }];
    component.totalPages = 5;
    component.currentPage = 1;
    component.isAscending = true;
    component.currentSort = 'name';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have input properties', () => {
    component.data = [{ id: 1, name: 'Test' }];
    component.columns = [{ key: 'name', label: 'Name', sortable: true }];
    component.totalPages = 5;
    component.currentPage = 1;
    component.isAscending = true;
    component.currentSort = 'name';

    fixture.detectChanges();

    expect(component.data).toEqual([{ id: 1, name: 'Test' }]);
    expect(component.columns).toEqual([
      { key: 'name', label: 'Name', sortable: true },
    ]);
    expect(component.totalPages).toBe(5);
    expect(component.currentPage).toBe(1);
    expect(component.isAscending).toBe(true);
    expect(component.currentSort).toBe('name');
  });

  it('should emit pageChange event on changePage', () => {
    jest.spyOn(component.pageChange, 'emit');
    component.changePage(2);
    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });

  it('should emit sortChange event on onSortChange', () => {
    jest.spyOn(component.sortChange, 'emit');
    component.currentSort = 'name';
    component.onSortChange('name');
    expect(component.sortChange.emit).toHaveBeenCalledWith({
      sortBy: 'name',
      isAscending: false,
    });
  });

  it('should emit rowsPerPageChange event on onRowsPerPageChange', () => {
    jest.spyOn(component.rowsPerPageChange, 'emit');
    const event = new Event('change');
    Object.defineProperty(event, 'target', { value: { value: '10' } });
    component.onRowsPerPageChange(event);
    expect(component.rowsPerPageChange.emit).toHaveBeenCalledWith(10);
    expect(component.rowsPerPage).toBe(10);
  });

  it('should return correct pages to show', () => {
    component.columns = [{ key: 'name', label: 'Name', sortable: true }];
    component.totalPages = 10;
    component.currentPage = 5;
    fixture.detectChanges();

    let pages = component.getPagesToShow();
    expect(pages).toEqual([0, -1, 4, 5, 6, -1, 9]);

    component.totalPages = 3;
    component.currentPage = 1;
    fixture.detectChanges();

    pages = component.getPagesToShow();
    expect(pages).toEqual([0, 1, 2]);
  });

  it('should render table headers correctly', () => {
    component.columns = [{ key: 'name', label: 'Name', sortable: true }];
    fixture.detectChanges();

    const headers = debugElement.queryAll(By.css('thead th'));
    expect(headers.length).toBe(1);
    expect(headers[0].nativeElement.textContent.trim()).toBe('Name');
  });

  it('should render table rows correctly', () => {
    const rows = fixture.debugElement.queryAll(By.css('.table__row'));
    expect(rows.length).toBe(1);

    const cells = rows[0].queryAll(By.directive(TableCellComponent));
    expect(cells.length).toBe(component.columns.length);
    expect(cells[0].componentInstance.content).toBe('Test');
  });

  it('should disable previous button on first page', () => {
    component.columns = [{ key: 'name', label: 'Name', sortable: true }];
    component.currentPage = 0;
    fixture.detectChanges();

    const prevButton = debugElement.query(
      By.css('.pagination-table__button:first-child')
    );
    expect(prevButton.nativeElement.disabled).toBeTruthy();
  });

  it('should disable next button on last page', () => {
    component.currentPage = component.totalPages - 1;
    fixture.detectChanges();

    const nextButton = debugElement.query(
      By.css('.pagination-table__button:last-child')
    );
    expect(nextButton.nativeElement.disabled).toBeTruthy();
  });

  it('should call changePage on page button click', () => {
    jest.spyOn(component, 'changePage');
    component.totalPages = 3;
    component.currentPage = 1;
    fixture.detectChanges();

    const pageButtons = debugElement.queryAll(
      By.css('.pagination-table__page')
    );
    pageButtons[0].nativeElement.click();
    expect(component.changePage).toHaveBeenCalledWith(0);
  });

  it('should call onSortChange on header click', () => {
    jest.spyOn(component, 'onSortChange');
    fixture.detectChanges();

    const header = fixture.debugElement.query(By.css('th .table__cell button'));
    header.nativeElement.click();

    expect(component.onSortChange).toHaveBeenCalledWith('brandName');
  });

  it('should call onRowsPerPageChange on rows per page change', () => {
    jest.spyOn(component, 'onRowsPerPageChange');
    const select = debugElement.query(By.css('#rowsPerPage'));
    select.triggerEventHandler('change', { target: { value: '10' } });
    expect(component.onRowsPerPageChange).toHaveBeenCalled();
  });
  
});

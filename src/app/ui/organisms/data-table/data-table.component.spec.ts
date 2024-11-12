import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTableComponent } from './data-table.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { AuthService } from '@/app/shared/services/auth/auth.service';

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;
  let debugElement: DebugElement;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const authServiceMock = {
      getUserRole: jest.fn().mockReturnValue('ROLE_AUX_BODEGA'),
    };

    await TestBed.configureTestingModule({
      declarations: [DataTableComponent],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;

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

  it('should render table headers correctly', () => {
    component.columns = [{ key: 'name', label: 'Name', sortable: true }];
    fixture.detectChanges();

    const headers = debugElement.queryAll(By.css('thead th'));
    expect(headers.length).toBe(1);
    expect(headers[0].nativeElement.textContent.trim()).toBe('Name');
  });

  it('should render table rows correctly', () => {
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('.table__row'));
    expect(rows.length).toBe(1);

    const cells = rows[0].queryAll(By.css('td'));
    expect(cells.length).toBe(component.columns.length);
    expect(cells[0].nativeElement.textContent.trim()).toBe('Test');
  });


  it('should call onSortChange on header click', () => {
    jest.spyOn(component, 'onSortChange');
    fixture.detectChanges();

    const header = fixture.debugElement.query(By.css('thead th button'));
    header.nativeElement.click();

    expect(component.onSortChange).toHaveBeenCalledWith('name');
  });

  it('should call onRowsPerPageChange on rows per page change', () => {
    jest.spyOn(component, 'onRowsPerPageChange');
    const select = debugElement.query(By.css('#rowsPerPage'));
    select.triggerEventHandler('change', { target: { value: '10' } });
    expect(component.onRowsPerPageChange).toHaveBeenCalled();
  });

  it('should emit incrementClick event on onIncrementClick', () => {
    jest.spyOn(component.incrementClick, 'emit');
    const row = { id: 1, name: 'Test' };
    component.onIncrementClick(row);
    expect(component.incrementClick.emit).toHaveBeenCalledWith(row);
  });

  it('should return true for canShowActions if showActions is true and user role is ROLE_AUX_BODEGA', () => {
    component.showActions = true;
    expect(component.canShowActions()).toBe(true);
  });

  it('should return false for canShowActions if showActions is false', () => {
    component.showActions = false;
    expect(component.canShowActions()).toBe(false);
  });

  it('should return false for canShowActions if user role is not ROLE_AUX_BODEGA', () => {
    authService.getUserRole.mockReturnValue('ROLE_USER');
    component.showActions = true;
    expect(component.canShowActions()).toBe(false);
  });
});
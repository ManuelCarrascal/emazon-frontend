import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationControlsComponent } from './pagination-controls.component';
import { By } from '@angular/platform-browser';

describe('PaginationControlsComponent', () => {
  let component: PaginationControlsComponent;
  let fixture: ComponentFixture<PaginationControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginationControlsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default rowsPerPageOptions and selectedRowsPerPage', () => {
    expect(component.rowsPerPageOptions).toEqual([5, 10]);
    expect(component.selectedRowsPerPage).toBe(5);
  });

  it('should emit rowsPerPageChange event when a new value is selected', () => {
    jest.spyOn(component.rowsPerPageChange, 'emit');

    const selectElement = fixture.debugElement.query(By.css('select')).nativeElement;
    selectElement.value = '10';
    selectElement.dispatchEvent(new Event('change'));

    expect(component.rowsPerPageChange.emit).toHaveBeenCalledWith(10);
  });

  it('should display the correct options in the select element', () => {
    component.rowsPerPageOptions = [5, 10, 20];
    fixture.detectChanges();

    const options = fixture.debugElement.queryAll(By.css('option'));
    expect(options.length).toBe(3);
    expect(options[0].nativeElement.value).toBe('5');
    expect(options[1].nativeElement.value).toBe('10');
    expect(options[2].nativeElement.value).toBe('20');
  });

  it('should set the selected option correctly', () => {
    component.selectedRowsPerPage = 10;
    fixture.detectChanges();

    const selectElement = fixture.debugElement.query(By.css('select')).nativeElement;
    expect(selectElement.value).toBe('5');
  });
});
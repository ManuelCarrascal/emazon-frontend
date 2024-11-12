import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { By } from '@angular/platform-browser';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit pageChange event when changePage is called', () => {
    const pageChangeSpy = jest.spyOn(component.pageChange, 'emit');
    const page = 2;
    component.changePage(page);
    expect(pageChangeSpy).toHaveBeenCalledWith(page);
  });

  it('should return correct pages to show when totalPages is less than or equal to 5', () => {
    component.totalPages = 3;
    component.currentPage = 1;
    const pages = component.getPagesToShow();
    expect(pages).toEqual([0, 1, 2]);
  });

  it('should return correct pages to show when currentPage is at the beginning', () => {
    component.totalPages = 10;
    component.currentPage = 1;
    const pages = component.getPagesToShow();
    expect(pages).toEqual([0, 1, 2, 3, 4, -1, 9]);
  });

  it('should return correct pages to show when currentPage is at the end', () => {
    component.totalPages = 10;
    component.currentPage = 8;
    const pages = component.getPagesToShow();
    expect(pages).toEqual([0, -1, 5, 6, 7, 8, 9]);
  });

  it('should return correct pages to show when currentPage is in the middle', () => {
    component.totalPages = 10;
    component.currentPage = 5;
    const pages = component.getPagesToShow();
    expect(pages).toEqual([0, -1, 4, 5, 6, -1, 9]);
  });

  it('should render pagination buttons correctly', () => {
    component.totalPages = 3;
    component.currentPage = 1;
    fixture.detectChanges();

    const pageButtons = fixture.debugElement.queryAll(By.css('.pagination-table__page'));
    expect(pageButtons.length).toBe(3);
    expect(pageButtons[0].nativeElement.textContent).toBe(' 1 ');
    expect(pageButtons[1].nativeElement.textContent).toBe(' 2 ');
    expect(pageButtons[2].nativeElement.textContent).toBe(' 3 ');
  });

  it('should call changePage when a page button is clicked', () => {
    const changePageSpy = jest.spyOn(component, 'changePage');
    component.totalPages = 3;
    component.currentPage = 1;
    fixture.detectChanges();

    const pageButtons = fixture.debugElement.queryAll(By.css('.pagination-table__page'));
    pageButtons[1].nativeElement.click();
    expect(changePageSpy).toHaveBeenCalledWith(1);
  });

  it('should disable previous button on first page', () => {
    component.totalPages = 3;
    component.currentPage = 0;
    fixture.detectChanges();

    const prevButton = fixture.debugElement.query(By.css('.pagination-table__button'));
    expect(prevButton.nativeElement.disabled).toBeTruthy();
  });

  it('should disable next button on last page', () => {
    component.totalPages = 3;
    component.currentPage = 2;
    fixture.detectChanges();

    const nextButton = fixture.debugElement.queryAll(By.css('.pagination-table__button'))[1];
    expect(nextButton.nativeElement.disabled).toBeTruthy();
  });

  it('should enable previous and next buttons on middle page', () => {
    component.totalPages = 3;
    component.currentPage = 1;
    fixture.detectChanges();

    const prevButton = fixture.debugElement.query(By.css('.pagination-table__button'));
    const nextButton = fixture.debugElement.queryAll(By.css('.pagination-table__button'))[1];
    expect(prevButton.nativeElement.disabled).toBeFalsy();
    expect(nextButton.nativeElement.disabled).toBeFalsy();
  });
});
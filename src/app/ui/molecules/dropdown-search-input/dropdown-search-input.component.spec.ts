import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownSearchInputComponent } from './dropdown-search-input.component';

describe('DropdownSearchInputComponent', () => {
  let component: DropdownSearchInputComponent;
  let fixture: ComponentFixture<DropdownSearchInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownSearchInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownSearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

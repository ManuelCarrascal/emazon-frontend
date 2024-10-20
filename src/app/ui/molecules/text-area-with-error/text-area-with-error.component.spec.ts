import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextAreaWithErrorComponent } from './text-area-with-error.component';

describe('TextAreaWithErrorComponent', () => {
  let component: TextAreaWithErrorComponent;
  let fixture: ComponentFixture<TextAreaWithErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextAreaWithErrorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextAreaWithErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

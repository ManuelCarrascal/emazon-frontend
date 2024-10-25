import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseAssistantComponent } from './warehouse-assistant.component';

describe('WarehouseAssistantComponent', () => {
  let component: WarehouseAssistantComponent;
  let fixture: ComponentFixture<WarehouseAssistantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseAssistantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseAssistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { WarehouseAssistantService } from './warehouse-assistant.service';

describe('WarehouseAssistantService', () => {
  let service: WarehouseAssistantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WarehouseAssistantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

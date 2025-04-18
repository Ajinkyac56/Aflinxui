import { TestBed } from '@angular/core/testing';

import { MasterSelectTypeService } from './master-select-type.service';

describe('MasterSelectTypeService', () => {
  let service: MasterSelectTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterSelectTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

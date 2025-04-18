import { TestBed } from '@angular/core/testing';

import { RequirementWeightService } from './requirement-weight.service';

describe('RequirementWeightService', () => {
  let service: RequirementWeightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequirementWeightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

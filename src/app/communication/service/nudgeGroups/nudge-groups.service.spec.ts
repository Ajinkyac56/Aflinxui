import { TestBed } from '@angular/core/testing';

import { NudgeGroupsService } from './nudge-groups.service';

describe('NudgeGroupsService', () => {
  let service: NudgeGroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NudgeGroupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

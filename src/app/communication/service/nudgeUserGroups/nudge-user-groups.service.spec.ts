import { TestBed } from '@angular/core/testing';

import { NudgeUserGroupsService } from './nudge-user-groups.service';

describe('NudgeUserGroupsService', () => {
  let service: NudgeUserGroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NudgeUserGroupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

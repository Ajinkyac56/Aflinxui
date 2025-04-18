import { TestBed } from '@angular/core/testing';

import { UserSharedDataService } from './user-shared-data.service';

describe('UserSharedDataService', () => {
  let service: UserSharedDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSharedDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

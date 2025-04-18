import { TestBed } from '@angular/core/testing';

import { SquadronService } from './squadron.service';

describe('SquadronService', () => {
  let service: SquadronService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SquadronService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

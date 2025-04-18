import { TestBed } from '@angular/core/testing';

import { DesignationLetterService } from './designation-letter.service';

describe('DesignationLetterService', () => {
  let service: DesignationLetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesignationLetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

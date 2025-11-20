import { TestBed } from '@angular/core/testing';

import { CampusInfoService } from './campus-info.service';

describe('CampusInfo', () => {
  let service: CampusInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CampusInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

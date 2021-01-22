import { TestBed } from '@angular/core/testing';

import { RequestResponseService } from './request-response.service';

describe('RequestResponseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RequestResponseService = TestBed.get(RequestResponseService);
    expect(service).toBeTruthy();
  });
});

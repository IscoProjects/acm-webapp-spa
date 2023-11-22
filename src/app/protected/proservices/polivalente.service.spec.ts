import { TestBed } from '@angular/core/testing';

import { PolivalenteService } from './polivalente.service';

describe('PolivalenteService', () => {
  let service: PolivalenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolivalenteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

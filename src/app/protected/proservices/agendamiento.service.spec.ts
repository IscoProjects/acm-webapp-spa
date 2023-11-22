import { TestBed } from '@angular/core/testing';

import { AgendamientoService } from './agendamiento.service';

describe('AgendamientoService', () => {
  let service: AgendamientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgendamientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

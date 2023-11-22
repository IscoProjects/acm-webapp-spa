import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isNonAuthenticatedGuard } from './is-non-authenticated.guard';

describe('isNonAuthenticatedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isNonAuthenticatedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

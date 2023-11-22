import { TestBed } from '@angular/core/testing';

import { TokenVerifyGuard } from './token-verify.guard';

describe('TokenVerifyGuard', () => {
  let guard: TokenVerifyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TokenVerifyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

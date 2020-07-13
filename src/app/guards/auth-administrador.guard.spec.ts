import { TestBed } from '@angular/core/testing';

import { AuthAdministradorGuard } from './auth-administrador.guard';

describe('AuthAdministradorGuard', () => {
  let guard: AuthAdministradorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthAdministradorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

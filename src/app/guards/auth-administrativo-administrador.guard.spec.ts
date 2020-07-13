import { TestBed } from '@angular/core/testing';

import { AuthAdministrativoAdministradorGuard } from './auth-administrativo-administrador.guard';

describe('AuthAdministrativoAdministradorGuard', () => {
  let guard: AuthAdministrativoAdministradorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthAdministrativoAdministradorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

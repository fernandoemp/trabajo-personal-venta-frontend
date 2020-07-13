import { TestBed } from '@angular/core/testing';

import { PublicacionFbService } from './publicacion-fb.service';

describe('PublicacionFbService', () => {
  let service: PublicacionFbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicacionFbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

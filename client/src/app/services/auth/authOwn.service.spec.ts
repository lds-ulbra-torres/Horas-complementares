import { TestBed, inject } from '@angular/core/testing';

import { AuthOwnService } from './authOwn.service';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthOwnService]
    });
  });

  it('should be created', inject([AuthOwnService], (service: AuthOwnService) => {
    expect(service).toBeTruthy();
  }));
});

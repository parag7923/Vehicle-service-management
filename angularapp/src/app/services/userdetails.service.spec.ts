import { TestBed } from '@angular/core/testing';

import { UserdetailsService } from './userdetails.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserdetailsService', () => {
  let service: UserdetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UserdetailsService);
  });

  fit('frontend_should_create_userdetails_service', () => {
    expect(service).toBeTruthy();
  });
});

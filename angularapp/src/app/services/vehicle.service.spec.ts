import { TestBed } from '@angular/core/testing';

import { VehicleService } from './vehicle.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('VehicleService', () => {
  let service: VehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(VehicleService);
  });

  fit('frontend_should_create_vehicle_service', () => {
    expect(service).toBeTruthy();
  });
});

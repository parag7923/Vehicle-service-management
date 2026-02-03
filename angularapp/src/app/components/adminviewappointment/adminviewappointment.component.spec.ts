import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminviewappointmentComponent } from './adminviewappointment.component';

describe('AdminviewappointmentComponent', () => {
  let component: AdminviewappointmentComponent;
  let fixture: ComponentFixture<AdminviewappointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminviewappointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminviewappointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserviewappointmentComponent } from './userviewappointment.component';

describe('UserviewappointmentComponent', () => {
  let component: UserviewappointmentComponent;
  let fixture: ComponentFixture<UserviewappointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserviewappointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserviewappointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

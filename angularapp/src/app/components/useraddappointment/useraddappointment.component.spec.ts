import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseraddappointmentComponent } from './useraddappointment.component';

describe('UseraddappointmentComponent', () => {
  let component: UseraddappointmentComponent;
  let fixture: ComponentFixture<UseraddappointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UseraddappointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseraddappointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

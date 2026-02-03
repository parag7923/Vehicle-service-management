import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminviewserviceComponent } from './adminviewservice.component';

describe('AdminviewserviceComponent', () => {
  let component: AdminviewserviceComponent;
  let fixture: ComponentFixture<AdminviewserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminviewserviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminviewserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

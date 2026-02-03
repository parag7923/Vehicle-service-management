import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminaddserviceComponent } from './adminaddservice.component';

describe('AdminaddserviceComponent', () => {
  let component: AdminaddserviceComponent;
  let fixture: ComponentFixture<AdminaddserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminaddserviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminaddserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

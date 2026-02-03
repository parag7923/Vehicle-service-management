import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminviewuserdetailsComponent } from './adminviewuserdetails.component';

describe('AdminviewuserdetailsComponent', () => {
  let component: AdminviewuserdetailsComponent;
  let fixture: ComponentFixture<AdminviewuserdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminviewuserdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminviewuserdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

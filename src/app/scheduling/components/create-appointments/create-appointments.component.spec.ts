import { ComponentFixture, TestBed } from '@angular/core/testing';

import { createAppointmentsComponent } from './create-appointments.component';

describe('AppointmentsComponent', () => {
  let component: createAppointmentsComponent;
  let fixture: ComponentFixture<createAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [createAppointmentsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(createAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

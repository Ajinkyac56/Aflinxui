import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentSlotDialogComponent } from './appointment-slot-dialog.component';

describe('AppointmentSlotDialogComponent', () => {
  let component: AppointmentSlotDialogComponent;
  let fixture: ComponentFixture<AppointmentSlotDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppointmentSlotDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentSlotDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

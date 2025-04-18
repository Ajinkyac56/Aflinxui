import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentViewDialogComponent } from './appointment-view-dialog.component';

describe('AppointmentViewDialogComponent', () => {
  let component: AppointmentViewDialogComponent;
  let fixture: ComponentFixture<AppointmentViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentViewDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

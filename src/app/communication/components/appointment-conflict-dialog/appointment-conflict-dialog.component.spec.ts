import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentConfilctDialogComponent } from './appointment-conflict-dialog.component';

describe('WorkDialogComponent', () => {
  let component: AppointmentConfilctDialogComponent;
  let fixture: ComponentFixture<AppointmentConfilctDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppointmentConfilctDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentConfilctDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

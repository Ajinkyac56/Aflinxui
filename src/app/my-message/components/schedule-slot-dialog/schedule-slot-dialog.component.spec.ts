import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleSlotDialogComponent } from './schedule-slot-dialog.component';

describe('WorkDialogComponent', () => {
  let component: ScheduleSlotDialogComponent;
  let fixture: ComponentFixture<ScheduleSlotDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduleSlotDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleSlotDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

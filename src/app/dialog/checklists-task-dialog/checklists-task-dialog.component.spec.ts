import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistsTaskDialogComponent } from './checklists-task-dialog.component';

describe('ChecklistsTaskDialogComponent', () => {
  let component: ChecklistsTaskDialogComponent;
  let fixture: ComponentFixture<ChecklistsTaskDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChecklistsTaskDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChecklistsTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageChecklistDialogComponent } from './manage-checklist-dialog.component';

describe('ManageChecklistDialogComponent', () => {
  let component: ManageChecklistDialogComponent;
  let fixture: ComponentFixture<ManageChecklistDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageChecklistDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageChecklistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageChecklistComponent } from './manage-checklist.component';

describe('ManageChecklistComponent', () => {
  let component: ManageChecklistComponent;
  let fixture: ComponentFixture<ManageChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageChecklistComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

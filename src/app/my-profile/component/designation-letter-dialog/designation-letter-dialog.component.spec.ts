import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationLetterDialogComponent } from './designation-letter-dialog.component';

describe('DesignationLetterDialogComponent', () => {
  let component: DesignationLetterDialogComponent;
  let fixture: ComponentFixture<DesignationLetterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DesignationLetterDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignationLetterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

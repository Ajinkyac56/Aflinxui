import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialityDialogComponent } from './speciality-dialog.component';

describe('SpecialityDialogComponent', () => {
  let component: SpecialityDialogComponent;
  let fixture: ComponentFixture<SpecialityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpecialityDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

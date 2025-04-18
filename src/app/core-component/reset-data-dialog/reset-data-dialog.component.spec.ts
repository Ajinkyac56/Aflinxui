import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetDataDialogComponent } from './reset-data-dialog.component';

describe('ResetDataDialogComponent', () => {
  let component: ResetDataDialogComponent;
  let fixture: ComponentFixture<ResetDataDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetDataDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

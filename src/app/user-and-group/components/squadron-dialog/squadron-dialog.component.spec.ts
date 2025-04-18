import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquadronDialogComponent } from './squadron-dialog.component';

describe('SquadronDialogComponent', () => {
  let component: SquadronDialogComponent;
  let fixture: ComponentFixture<SquadronDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SquadronDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SquadronDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

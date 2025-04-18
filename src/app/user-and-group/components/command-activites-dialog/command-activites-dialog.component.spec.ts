import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandActivitesDialogComponent } from './command-activites-dialog.component';

describe('CommandActivitesDialogComponent', () => {
  let component: CommandActivitesDialogComponent;
  let fixture: ComponentFixture<CommandActivitesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommandActivitesDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandActivitesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandActivityViewComponent } from './command-activity-view.component';

describe('NudgeGroupsViewComponent', () => {
  let component: CommandActivityViewComponent;
  let fixture: ComponentFixture<CommandActivityViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommandActivityViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandActivityViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

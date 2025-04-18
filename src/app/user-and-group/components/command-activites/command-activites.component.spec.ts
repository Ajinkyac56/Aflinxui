import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandActivitesComponent } from './command-activites.component';

describe('CommandActivitesComponent', () => {
  let component: CommandActivitesComponent;
  let fixture: ComponentFixture<CommandActivitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommandActivitesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandActivitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

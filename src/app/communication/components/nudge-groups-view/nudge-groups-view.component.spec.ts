import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NudgeGroupsViewComponent } from './nudge-groups-view.component';

describe('NudgeGroupsViewComponent', () => {
  let component: NudgeGroupsViewComponent;
  let fixture: ComponentFixture<NudgeGroupsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NudgeGroupsViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NudgeGroupsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NudgeGroupsComponent } from './nudge-groups.component';

describe('NudgeGroupsComponent', () => {
  let component: NudgeGroupsComponent;
  let fixture: ComponentFixture<NudgeGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NudgeGroupsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NudgeGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

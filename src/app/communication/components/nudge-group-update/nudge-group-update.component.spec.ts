import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NudgeGroupUpdateComponent } from './nudge-group-update.component';

describe('NudgeGroupUpdateComponent', () => {
  let component: NudgeGroupUpdateComponent;
  let fixture: ComponentFixture<NudgeGroupUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NudgeGroupUpdateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NudgeGroupUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

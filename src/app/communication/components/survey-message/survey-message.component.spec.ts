import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyMessageComponent } from './survey-message.component';

describe('SurveyMessageComponent', () => {
  let component: SurveyMessageComponent;
  let fixture: ComponentFixture<SurveyMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

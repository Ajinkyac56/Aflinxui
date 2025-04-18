import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementWeightComponent } from './requirement-weight.component';

describe('RequirementWeightComponent', () => {
  let component: RequirementWeightComponent;
  let fixture: ComponentFixture<RequirementWeightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequirementWeightComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementWeightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

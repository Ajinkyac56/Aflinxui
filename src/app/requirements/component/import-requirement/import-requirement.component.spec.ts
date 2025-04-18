import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportRequirementComponent } from './import-requirement.component';

describe('ImportAirmanComponent', () => {
  let component: ImportRequirementComponent;
  let fixture: ComponentFixture<ImportRequirementComponent>;

  beforeEach(async () => {
    +(await TestBed.configureTestingModule({
      declarations: [ImportRequirementComponent],
    }).compileComponents());
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

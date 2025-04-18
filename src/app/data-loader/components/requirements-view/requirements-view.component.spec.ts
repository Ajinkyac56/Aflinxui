import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementsViewComponent } from './requirements-view.component';

describe('RequirementsViewComponent', () => {
  let component: RequirementsViewComponent;
  let fixture: ComponentFixture<RequirementsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequirementsViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

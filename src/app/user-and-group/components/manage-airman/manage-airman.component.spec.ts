import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAirmanComponent } from './manage-airman.component';

describe('ManageAirmanComponent', () => {
  let component: ManageAirmanComponent;
  let fixture: ComponentFixture<ManageAirmanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageAirmanComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAirmanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAirmanComponent } from './create-airman.component';

describe('CreateAirmanComponent', () => {
  let component: CreateAirmanComponent;
  let fixture: ComponentFixture<CreateAirmanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateAirmanComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAirmanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

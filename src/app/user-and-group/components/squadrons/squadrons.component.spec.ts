import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquadronsComponent } from './squadrons.component';

describe('SquadronsComponent', () => {
  let component: SquadronsComponent;
  let fixture: ComponentFixture<SquadronsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SquadronsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SquadronsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

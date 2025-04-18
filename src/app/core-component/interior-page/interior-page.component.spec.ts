import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteriorPageComponent } from './interior-page.component';

describe('InteriorPageComponent', () => {
  let component: InteriorPageComponent;
  let fixture: ComponentFixture<InteriorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InteriorPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InteriorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaRosterComponent } from './alpha-roster.component';

describe('AlphaRosterComponent', () => {
  let component: AlphaRosterComponent;
  let fixture: ComponentFixture<AlphaRosterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlphaRosterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlphaRosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

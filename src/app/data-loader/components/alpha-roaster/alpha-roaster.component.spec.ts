import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaRoasterComponent } from './alpha-roaster.component';

describe('AlphaRoasterComponent', () => {
  let component: AlphaRoasterComponent;
  let fixture: ComponentFixture<AlphaRoasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlphaRoasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlphaRoasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

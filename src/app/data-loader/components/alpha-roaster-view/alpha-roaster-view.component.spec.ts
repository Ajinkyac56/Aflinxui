import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaRoasterViewComponent } from './alpha-roaster-view.component';

describe('AlphaRoasterViewComponent', () => {
  let component: AlphaRoasterViewComponent;
  let fixture: ComponentFixture<AlphaRoasterViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlphaRoasterViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlphaRoasterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartBoardComponent } from './smart-board.component';

describe('SmartBoardComponent', () => {
  let component: SmartBoardComponent;
  let fixture: ComponentFixture<SmartBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartBoardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SmartBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

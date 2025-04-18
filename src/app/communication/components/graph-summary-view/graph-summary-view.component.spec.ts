import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphSummaryViewComponent } from './graph-summary-view.component';

describe('GraphSummaryViewComponent', () => {
  let component: GraphSummaryViewComponent;
  let fixture: ComponentFixture<GraphSummaryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraphSummaryViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphSummaryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

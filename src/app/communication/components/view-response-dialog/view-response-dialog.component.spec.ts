import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseViewDialogComponent } from './view-response-dialog.component';

describe('WorkDialogComponent', () => {
  let component: ResponseViewDialogComponent;
  let fixture: ComponentFixture<ResponseViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResponseViewDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

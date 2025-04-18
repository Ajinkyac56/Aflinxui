import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquadronSubAdminViewComponent } from './squadron-sub-admin-view.component';

describe('SquadronSubAdminViewComponent', () => {
  let component: SquadronSubAdminViewComponent;
  let fixture: ComponentFixture<SquadronSubAdminViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SquadronSubAdminViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SquadronSubAdminViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

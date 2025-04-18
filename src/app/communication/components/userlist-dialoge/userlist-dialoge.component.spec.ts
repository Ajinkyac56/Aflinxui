import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListDialogComponent } from './userlist-dialoge.component';

describe('NudgeGroupsViewComponent', () => {
  let component: UserListDialogComponent;
  let fixture: ComponentFixture<UserListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserListDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

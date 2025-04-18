import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateNudgeGroupComponent } from './create-nudge-group.component';

describe('CreateAnnouncementComponent', () => {
  let component: CreateNudgeGroupComponent;
  let fixture: ComponentFixture<CreateNudgeGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateNudgeGroupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNudgeGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

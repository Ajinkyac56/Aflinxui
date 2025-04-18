import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportAirmanComponent } from './import-airman.component';

describe('ImportAirmanComponent', () => {
  let component: ImportAirmanComponent;
  let fixture: ComponentFixture<ImportAirmanComponent>;

  beforeEach(async () => {
    +(await TestBed.configureTestingModule({
      declarations: [ImportAirmanComponent],
    }).compileComponents());
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportAirmanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

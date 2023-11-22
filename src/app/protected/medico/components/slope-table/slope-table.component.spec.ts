import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlopeTableComponent } from './slope-table.component';

describe('SlopeTableComponent', () => {
  let component: SlopeTableComponent;
  let fixture: ComponentFixture<SlopeTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SlopeTableComponent]
    });
    fixture = TestBed.createComponent(SlopeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

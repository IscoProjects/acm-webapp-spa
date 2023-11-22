import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryTableComponent } from './summary-table.component';

describe('SummaryTableComponent', () => {
  let component: SummaryTableComponent;
  let fixture: ComponentFixture<SummaryTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SummaryTableComponent]
    });
    fixture = TestBed.createComponent(SummaryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgrCalendarComponent } from './agr-calendar.component';

describe('AgrCalendarComponent', () => {
  let component: AgrCalendarComponent;
  let fixture: ComponentFixture<AgrCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgrCalendarComponent]
    });
    fixture = TestBed.createComponent(AgrCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

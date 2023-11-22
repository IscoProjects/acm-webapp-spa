import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCalendarComponent } from './admin-calendar.component';

describe('AdminCalendarComponent', () => {
  let component: AdminCalendarComponent;
  let fixture: ComponentFixture<AdminCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCalendarComponent]
    });
    fixture = TestBed.createComponent(AdminCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

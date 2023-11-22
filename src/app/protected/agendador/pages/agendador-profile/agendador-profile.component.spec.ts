import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendadorProfileComponent } from './agendador-profile.component';

describe('AgendadorProfileComponent', () => {
  let component: AgendadorProfileComponent;
  let fixture: ComponentFixture<AgendadorProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendadorProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendadorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

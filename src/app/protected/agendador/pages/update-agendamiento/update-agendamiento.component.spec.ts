import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAgendamientoComponent } from './update-agendamiento.component';

describe('UpdateAgendamientoComponent', () => {
  let component: UpdateAgendamientoComponent;
  let fixture: ComponentFixture<UpdateAgendamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateAgendamientoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAgendamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

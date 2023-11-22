import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAgendamientoComponent } from './create-agendamiento.component';

describe('CreateAgendamientoComponent', () => {
  let component: CreateAgendamientoComponent;
  let fixture: ComponentFixture<CreateAgendamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAgendamientoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAgendamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

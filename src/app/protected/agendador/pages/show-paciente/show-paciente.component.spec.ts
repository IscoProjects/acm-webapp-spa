import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPacienteComponent } from './show-paciente.component';

describe('ShowPacienteComponent', () => {
  let component: ShowPacienteComponent;
  let fixture: ComponentFixture<ShowPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowPacienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

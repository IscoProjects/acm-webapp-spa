import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicoProfileComponent } from './medico-profile.component';

describe('MedicoProfileComponent', () => {
  let component: MedicoProfileComponent;
  let fixture: ComponentFixture<MedicoProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicoProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicoProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

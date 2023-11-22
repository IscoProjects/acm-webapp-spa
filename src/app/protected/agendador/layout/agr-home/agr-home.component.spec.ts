import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgrHomeComponent } from './agr-home.component';

describe('AgrHomeComponent', () => {
  let component: AgrHomeComponent;
  let fixture: ComponentFixture<AgrHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgrHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgrHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

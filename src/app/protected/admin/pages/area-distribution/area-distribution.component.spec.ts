import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaDistributionComponent } from './area-distribution.component';

describe('AreaDistributionComponent', () => {
  let component: AreaDistributionComponent;
  let fixture: ComponentFixture<AreaDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaDistributionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

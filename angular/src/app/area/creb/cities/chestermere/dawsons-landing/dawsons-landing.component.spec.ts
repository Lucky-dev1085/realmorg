import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DawsonsLandingComponent } from './dawsons-landing.component';

describe('DawsonsLandingComponent', () => {
  let component: DawsonsLandingComponent;
  let fixture: ComponentFixture<DawsonsLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DawsonsLandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DawsonsLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MortgageContactComponent } from './mortgage-contact.component';

describe('MortgageContactComponent', () => {
  let component: MortgageContactComponent;
  let fixture: ComponentFixture<MortgageContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MortgageContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MortgageContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

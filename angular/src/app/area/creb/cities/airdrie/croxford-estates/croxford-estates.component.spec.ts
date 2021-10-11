import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CroxfordEstatesComponent } from './croxford-estates.component';

describe('CroxfordEstatesComponent', () => {
  let component: CroxfordEstatesComponent;
  let fixture: ComponentFixture<CroxfordEstatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CroxfordEstatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CroxfordEstatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

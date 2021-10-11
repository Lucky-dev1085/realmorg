import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HamiltonGreensComponent } from './hamilton-greens.component';

describe('HamiltonGreensComponent', () => {
  let component: HamiltonGreensComponent;
  let fixture: ComponentFixture<HamiltonGreensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HamiltonGreensComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HamiltonGreensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

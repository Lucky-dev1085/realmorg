import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChesterviewEstatesComponent } from './chesterview-estates.component';

describe('ChesterviewEstatesComponent', () => {
  let component: ChesterviewEstatesComponent;
  let fixture: ComponentFixture<ChesterviewEstatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChesterviewEstatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChesterviewEstatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

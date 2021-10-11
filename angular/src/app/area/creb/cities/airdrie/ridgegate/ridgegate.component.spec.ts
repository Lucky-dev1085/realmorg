import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RidgegateComponent } from './ridgegate.component';

describe('RidgegateComponent', () => {
  let component: RidgegateComponent;
  let fixture: ComponentFixture<RidgegateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RidgegateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RidgegateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

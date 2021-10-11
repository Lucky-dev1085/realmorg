import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrebNavBarComponent } from './creb-nav-bar.component';

describe('CrebNavBarComponent', () => {
  let component: CrebNavBarComponent;
  let fixture: ComponentFixture<CrebNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrebNavBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrebNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

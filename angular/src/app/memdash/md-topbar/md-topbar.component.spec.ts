import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdTopbarComponent } from './md-topbar.component';

describe('MdTopbarComponent', () => {
  let component: MdTopbarComponent;
  let fixture: ComponentFixture<MdTopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdTopbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

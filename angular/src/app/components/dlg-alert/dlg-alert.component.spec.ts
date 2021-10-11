import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DlgAlertComponent } from './dlg-alert.component';

describe('DlgAlertComponent', () => {
  let component: DlgAlertComponent;
  let fixture: ComponentFixture<DlgAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DlgAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DlgAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

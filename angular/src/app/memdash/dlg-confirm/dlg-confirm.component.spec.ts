import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DlgConfirmComponent } from './dlg-confirm.component';

describe('DlgConfirmComponent', () => {
  let component: DlgConfirmComponent;
  let fixture: ComponentFixture<DlgConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DlgConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DlgConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DlgCreateLeadComponent } from './dlg-create-lead.component';

describe('DlgCreateLeadComponent', () => {
  let component: DlgCreateLeadComponent;
  let fixture: ComponentFixture<DlgCreateLeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DlgCreateLeadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DlgCreateLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DlgLeadsDetailComponent } from './dlg-leads-detail.component';

describe('DlgLeadsDetailComponent', () => {
  let component: DlgLeadsDetailComponent;
  let fixture: ComponentFixture<DlgLeadsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DlgLeadsDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DlgLeadsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

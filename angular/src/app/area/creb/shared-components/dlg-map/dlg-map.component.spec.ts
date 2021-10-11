import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DlgMapComponent } from './dlg-map.component';

describe('DlgMapComponent', () => {
  let component: DlgMapComponent;
  let fixture: ComponentFixture<DlgMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DlgMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DlgMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

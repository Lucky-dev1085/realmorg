import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DlgShowGalleryConfirmComponent } from './dlg-show-gallery-confirm.component';

describe('DlgShowGalleryConfirmComponent', () => {
  let component: DlgShowGalleryConfirmComponent;
  let fixture: ComponentFixture<DlgShowGalleryConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DlgShowGalleryConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DlgShowGalleryConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMetacontentComponent } from './dialog-metacontent.component';

describe('DialogMetacontentComponent', () => {
  let component: DialogMetacontentComponent;
  let fixture: ComponentFixture<DialogMetacontentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMetacontentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMetacontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

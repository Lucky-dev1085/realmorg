import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAlcontentComponent } from './dialog-alcontent.component';

describe('DialogAlcontentComponent', () => {
  let component: DialogAlcontentComponent;
  let fixture: ComponentFixture<DialogAlcontentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAlcontentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAlcontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

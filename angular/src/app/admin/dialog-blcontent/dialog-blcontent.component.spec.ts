import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBlcontentComponent } from './dialog-blcontent.component';

describe('DialogBlcontentComponent', () => {
  let component: DialogBlcontentComponent;
  let fixture: ComponentFixture<DialogBlcontentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogBlcontentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogBlcontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

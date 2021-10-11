import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlcontentComponent } from './blcontent.component';

describe('BlcontentComponent', () => {
  let component: BlcontentComponent;
  let fixture: ComponentFixture<BlcontentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlcontentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlcontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

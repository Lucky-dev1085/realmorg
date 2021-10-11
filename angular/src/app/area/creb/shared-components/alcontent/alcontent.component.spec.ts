import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlcontentComponent } from './alcontent.component';

describe('AlcontentComponent', () => {
  let component: AlcontentComponent;
  let fixture: ComponentFixture<AlcontentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlcontentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlcontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaContactComponent } from './area-contact.component';

describe('AreaContactComponent', () => {
  let component: AreaContactComponent;
  let fixture: ComponentFixture<AreaContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

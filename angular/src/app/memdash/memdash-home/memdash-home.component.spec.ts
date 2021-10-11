import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemdashHomeComponent } from './memdash-home.component';

describe('MemdashHomeComponent', () => {
  let component: MemdashHomeComponent;
  let fixture: ComponentFixture<MemdashHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemdashHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemdashHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

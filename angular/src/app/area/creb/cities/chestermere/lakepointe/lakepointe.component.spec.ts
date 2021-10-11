import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LakepointeComponent } from './lakepointe.component';

describe('LakepointeComponent', () => {
  let component: LakepointeComponent;
  let fixture: ComponentFixture<LakepointeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LakepointeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LakepointeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CobblestoneComponent } from './cobblestone.component';

describe('CobblestoneComponent', () => {
  let component: CobblestoneComponent;
  let fixture: ComponentFixture<CobblestoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CobblestoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CobblestoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

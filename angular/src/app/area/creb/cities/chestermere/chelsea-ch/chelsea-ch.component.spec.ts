import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChelseaCHComponent } from './chelsea-ch.component';

describe('ChelseaCHComponent', () => {
  let component: ChelseaCHComponent;
  let fixture: ComponentFixture<ChelseaCHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChelseaCHComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChelseaCHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

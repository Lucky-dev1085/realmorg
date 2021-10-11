import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YankeeValleyEstatesComponent } from './yankee-valley-estates.component';

describe('YankeeValleyEstatesComponent', () => {
  let component: YankeeValleyEstatesComponent;
  let fixture: ComponentFixture<YankeeValleyEstatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YankeeValleyEstatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YankeeValleyEstatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

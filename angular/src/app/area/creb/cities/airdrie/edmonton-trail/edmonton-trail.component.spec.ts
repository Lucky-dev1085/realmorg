import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdmontonTrailComponent } from './edmonton-trail.component';

describe('EdmontonTrailComponent', () => {
  let component: EdmontonTrailComponent;
  let fixture: ComponentFixture<EdmontonTrailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdmontonTrailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EdmontonTrailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

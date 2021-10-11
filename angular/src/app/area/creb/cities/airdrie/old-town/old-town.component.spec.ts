import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldTownComponent } from './old-town.component';

describe('OldTownComponent', () => {
  let component: OldTownComponent;
  let fixture: ComponentFixture<OldTownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OldTownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OldTownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

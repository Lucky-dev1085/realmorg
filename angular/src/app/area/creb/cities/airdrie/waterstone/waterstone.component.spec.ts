import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterstoneComponent } from './waterstone.component';

describe('WaterstoneComponent', () => {
  let component: WaterstoneComponent;
  let fixture: ComponentFixture<WaterstoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaterstoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterstoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

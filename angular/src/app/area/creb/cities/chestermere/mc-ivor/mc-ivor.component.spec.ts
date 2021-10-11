import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McIvorComponent } from './mc-ivor.component';

describe('McIvorComponent', () => {
  let component: McIvorComponent;
  let fixture: ComponentFixture<McIvorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ McIvorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(McIvorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

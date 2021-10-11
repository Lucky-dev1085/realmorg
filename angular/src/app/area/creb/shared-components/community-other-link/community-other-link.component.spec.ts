import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityOtherLinkComponent } from './community-other-link.component';

describe('CommunityOtherLinkComponent', () => {
  let component: CommunityOtherLinkComponent;
  let fixture: ComponentFixture<CommunityOtherLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunityOtherLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityOtherLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DlgTeamMemberComponent } from './dlg-team-member.component';

describe('DlgTeamMemberComponent', () => {
  let component: DlgTeamMemberComponent;
  let fixture: ComponentFixture<DlgTeamMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DlgTeamMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DlgTeamMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

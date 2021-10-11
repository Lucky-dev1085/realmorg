import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MemdashHomeComponent } from './memdash-home/memdash-home.component';
import { LeadsListComponent } from './leads-list/leads-list.component';
import { TeamMemberComponent } from './team-member/team-member.component';

const routes: Routes = [
  { path: '', component: MemdashHomeComponent },
  { path: 'leads', component: LeadsListComponent },
  { path: 'team-members', component: TeamMemberComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemdashRoutingModule { }

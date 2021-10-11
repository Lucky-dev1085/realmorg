import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* FormsModule */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Angular Flex Layout */
import { FlexLayoutModule } from "@angular/flex-layout";

import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';

import { AngularMaterialModule } from '../angular-material.module';

import { ComponentsModule } from '../components/components.module';

import { MemdashRoutingModule } from './memdash-routing.module';
import { MemdashHomeComponent } from './memdash-home/memdash-home.component';
import { LeadsListComponent } from './leads-list/leads-list.component';
import { TeamMemberComponent } from './team-member/team-member.component';

import { DlgLeadsDetailComponent } from './dlg-leads-detail/dlg-leads-detail.component';
import { DlgTeamMemberComponent } from './dlg-team-member/dlg-team-member.component';
import { DlgCreateLeadComponent } from './dlg-create-lead/dlg-create-lead.component';
import { DlgConfirmComponent } from './dlg-confirm/dlg-confirm.component';

@NgModule({
  declarations: [
    MemdashHomeComponent,
    LeadsListComponent,
    TeamMemberComponent,
    DlgLeadsDetailComponent,
    DlgTeamMemberComponent,
    DlgCreateLeadComponent,
    DlgConfirmComponent,
  ],
  imports: [
    CommonModule,
    MemdashRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    FlexLayoutModule,
    HttpClientModule,
    ComponentsModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule
  ]
})
export class MemdashModule { }

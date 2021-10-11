import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* FormsModule */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Angular Flex Layout */
import { FlexLayoutModule } from "@angular/flex-layout";

import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ComponentsModule } from '../components/components.module';

import { AngularMaterialModule } from '../angular-material.module';

import { AdminRoutingModule } from './admin-routing.module';
import { PageContentComponent } from './page-content/page-content.component';
import { DialogBlcontentComponent } from './dialog-blcontent/dialog-blcontent.component';
import { DialogAlcontentComponent } from './dialog-alcontent/dialog-alcontent.component';
import { DialogMetacontentComponent } from './dialog-metacontent/dialog-metacontent.component';
import { TeamPageComponent } from './team-page/team-page.component';


@NgModule({
  declarations: [
    PageContentComponent, 
    DialogBlcontentComponent, 
    DialogAlcontentComponent, DialogMetacontentComponent, TeamPageComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    FlexLayoutModule,
    HttpClientModule,
    ComponentsModule,
  ]
})
export class AdminModule { }

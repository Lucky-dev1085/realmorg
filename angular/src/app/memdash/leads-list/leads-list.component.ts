import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { TokenStorageService } from '../../_services/token-storage.service';

import { LeadsService } from '../../_services/leads.service';

import { MatDialog } from '@angular/material/dialog';
import { DlgLeadsDetailComponent } from '../dlg-leads-detail/dlg-leads-detail.component';
import { DlgCreateLeadComponent } from '../dlg-create-lead/dlg-create-lead.component';
import { DlgConfirmComponent } from '../dlg-confirm/dlg-confirm.component';

interface Leads {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  byTeam: string;
  teamId: string;
  team_member: Array<any>;
  status: string;
  comment: string;
  comment_list: Array<any>
  contact_again: string;
  accepted: string;
  created_at: string;
  perm_phone: string;
  perm_text: string;
  perm_email: string;
}

interface DialogData {
  selId: string;
}

interface DialogNewData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  byTeam: string;
  status: string;
  comment: string;
  comment_list: Array<any>,
  contact_again: '',
  type: string;
  subtype: string;
  accepted: string;
  perm_phone: string;
  perm_email: string;
  perm_text: string;
}

interface ConfirmDialogData {
  msg: string;
}

@Component({
  selector: 'app-leads-list',
  templateUrl: './leads-list.component.html',
  styleUrls: ['./leads-list.component.css']
})
export class LeadsListComponent implements OnInit {

  displayedColumns: string[] = ['first_name', 'last_name', 'email', 'phone', 'byTeam', 'status', 'comment'];
  leadsList: Leads[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  pageSize = 12;
  pageSizeOptions: number[] = [12, 24];

  // MatPaginator Output
  pageEvent: PageEvent;
  
  userInfo_member: any;

  errMsg: string;

  statusList = [];
  str_status: string = '';

  cur_year = (new Date()).getFullYear();
  str_year = "";
  str_month = "";

  yearList = [];

  monthList = [
    { value: '1', viewValue: 'January' },
    { value: '2', viewValue: 'February' },
    { value: '3', viewValue: 'March' },
    { value: '4', viewValue: 'April' },
    { value: '5', viewValue: 'May' },
    { value: '6', viewValue: 'June' },
    { value: '7', viewValue: 'July' },
    { value: '8', viewValue: 'August' },
    { value: '9', viewValue: 'September' },
    { value: '10', viewValue: 'October' },
    { value: '11', viewValue: 'November' },
    { value: '12', viewValue: 'December' },
  ];

  constructor(private leadsService: LeadsService, private tokenStorageService: TokenStorageService, public dialog: MatDialog) { 
    this.userInfo_member = this.tokenStorageService.getUser_member();
  }

  ngOnInit(): void {
    for(var i = 2020; i <= this.cur_year; i++) {
      this.yearList.push(i.toString());
    }

    this.getLeadsList(this.pageSize, 0);

    this.getLeadStatusList();
  }
  
  onPaginateChange($event) {
    this.pageSize = this.pageEvent.pageSize;
    this.getLeadsList(this.pageEvent.pageSize, this.pageEvent.pageIndex * this.pageEvent.pageSize);
  }

  getLeadsList(limit: number, offset: number) {
    
    this.isLoadingResults = false;
    this.leadsService.getLeadsList(limit, offset, this.userInfo_member.id, this.userInfo_member.role, this.str_status, this.str_year, this.str_month).subscribe(
      data => {
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = data.total_count;

        this.leadsList = data.items;
      },
      err => {
        this.errMsg = err.message;
      }
    )
  }

  getLeadStatusList() {
    this.leadsService.getLeadStatusList().subscribe(
      data => {
        this.statusList = data;
      },
      err => {
        this.errMsg = err.message;
      }
    )
  }

  onChangeStatus(newValue) {
    this.getLeadsList(this.pageSize, 0);
  }

  onChangeYear(newValue) {
    this.getLeadsList(this.pageSize, 0);
  }

  onChangeMonth(newValue) {
    this.getLeadsList(this.pageSize, 0);
  }

  showLeadDetail(selId) {
    let data: DialogData = {
      selId: selId
    }

    this.dialog.open<DlgLeadsDetailComponent>(DlgLeadsDetailComponent, { width: '800px', data: data})
      .afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
          this.getLeadsList(this.pageSize, 0);
      });
  }

  createNewLead() {
    let newData: DialogNewData = {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      byTeam: null,
      status: null,
      comment: '',
      comment_list: [],
      contact_again: '',
      type: null,
      subtype: null,
      accepted: '0',
      perm_phone: '0',
      perm_email: '0',
      perm_text: '0'
    }

    this.dialog.open<DlgCreateLeadComponent>(DlgCreateLeadComponent, { width: '800px', data: newData})
      .afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
          this.getLeadsList(this.pageSize, 0);
      });
  }

  deleteLead(selId) {
    let data: ConfirmDialogData = {
      msg: 'Do you want to delete this lead?'
    }

    this.dialog.open<DlgConfirmComponent>(DlgConfirmComponent, {data: data})
      .afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        if(result) {
          this.leadsService.deleteLead(selId).subscribe(
            data => {
              console.log(data);
              this.getLeadsList(this.pageSize, 0);
            },
            err => {
              this.errMsg = err.message;
            }
          )
        }
      });
  }

}

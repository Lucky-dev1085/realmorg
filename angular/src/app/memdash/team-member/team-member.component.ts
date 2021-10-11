import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { RESOURCE_URL } from '../../_services/endPoint';
import { UserService } from '../../_services/user.service';

import { MatDialog } from '@angular/material/dialog';
import { DlgTeamMemberComponent } from '../dlg-team-member/dlg-team-member.component';
import { DlgConfirmComponent } from '../dlg-confirm/dlg-confirm.component';

interface Leads {
  first_name: string;
  last_name: string;
  email: string;
  cell_phone: string;
  office_phone: string;
  type: string;
  address: string;
  avatar: string;
  content: string;
}

interface DialogData {
  selId: string;
  first_name: string;
  last_name: string;
  email: string;
  cell_phone: string;
  office_phone: string;
  type: string;
  address: string;
  avatar: string;
  content: string;
}

interface ConfirmDialogData {
  msg: string;
}

@Component({
  selector: 'app-team-member',
  templateUrl: './team-member.component.html',
  styleUrls: ['./team-member.component.css']
})
export class TeamMemberComponent implements OnInit {

  resourceURL = RESOURCE_URL;
  displayedColumns: string[] = ['first_name', 'last_name', 'type', 'email', 'cell_phone', 'office_phone'];
  leadsList: Leads[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  pageSize = 12;
  pageSizeOptions: number[] = [12, 24];

  // MatPaginator Output
  pageEvent: PageEvent;
  
  @ViewChild(MatSort) sort: MatSort;

  
  errMsg: string;

  constructor(private userService: UserService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getTeamList(this.pageSize, 0);
  }
  
  onPaginateChange($event) {
    this.pageSize = this.pageEvent.pageSize;
    this.getTeamList(this.pageEvent.pageSize, this.pageEvent.pageIndex * this.pageEvent.pageSize);
  }

  getTeamList(limit: number, offset: number) {
    this.isLoadingResults = false;
    this.userService.getTeamList(limit, offset).subscribe(
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

  createNewMember() {
    let data: DialogData = {
      selId: '',
      first_name: '',
      last_name: '',
      email: '',
      cell_phone: '',
      office_phone: '',
      type: '',
      address: '',
      avatar: '',
      content: ''
    }

    this.dialog.open<DlgTeamMemberComponent>(DlgTeamMemberComponent, { width: '800px', data: data})
      .afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        if(result) {
          this.getTeamList(this.pageSize, 0);
        }
      });
  }

  showLeadDetail(selId, first_name, last_name, email, cell_phone, office_phone, type, address, avatar, content) {
    let data: DialogData = {
      selId: selId,
      first_name: first_name,
      last_name: last_name,
      email: email,
      cell_phone: cell_phone,
      office_phone: office_phone,
      type: type,
      address: address,
      avatar: avatar,
      content: content
    }

    this.dialog.open<DlgTeamMemberComponent>(DlgTeamMemberComponent, { width: '800px', data: data})
      .afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        if(result) {
          this.getTeamList(this.pageSize, 0);
        }
      });
  }

  deleteMember(selId) {
    let data: ConfirmDialogData = {
      msg: 'Do you want to delete this member?'
    }

    this.dialog.open<DlgConfirmComponent>(DlgConfirmComponent, {data: data})
      .afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        if(result) {
          this.userService.deleteMember(selId).subscribe(
            data => {
              console.log(data);
              this.getTeamList(this.pageSize, 0);
            },
            err => {
              this.errMsg = err.message;
            }
          )
        }
      });
  }

  changePwd(selId) {
    let data: ConfirmDialogData = {
      msg: 'Do you want to change password of this member?'
    }

    this.dialog.open<DlgConfirmComponent>(DlgConfirmComponent, {data: data})
      .afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        if(result) {
          this.userService.changePwd(selId).subscribe(
            data => {
              console.log(data);
            },
            err => {
              this.errMsg = err.message;
            }
          )
        }
      });
  }

}

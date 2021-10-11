import { Component, Inject, OnInit } from '@angular/core';
import { LeadsService } from '../../_services/leads.service';
import { UserService } from '../../_services/user.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';

import { DlgConfirmComponent } from '../dlg-confirm/dlg-confirm.component';

interface DialogData {
  selId: string;
}

interface ConfirmDialogData {
  msg: string;
}

@Component({
  selector: 'app-dlg-leads-detai',
  templateUrl: './dlg-leads-detail.component.html',
  styleUrls: ['./dlg-leads-detail.component.css']
})
export class DlgLeadsDetailComponent implements OnInit {

  displayedColumns: string[] = ['date', 'team_member', 'comment', 'operator'];
  teamList = [];
  error: string;
  successMsg: string;
  userInfo_member: any;
  leadInfo = {
    _id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    byTeam: '',
    team_member: [],
    status: '',
    lead_status: [],
    comment: '',
    comment_list: [],
    contact_again: '',
    type: '',
    subtype: '',
    lead_type: [],
    lead_subtype: [],
    accepted: '0',
    perm_phone: '0',
    perm_email: '0',
    perm_text: '0',
    role: 'User'
  };

  statusList = [];

  commentList = [];
  typeList = [];
  subtypeList = [];

  str_comment: string;
  show_comment: boolean = false;

  public date: moment.Moment;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public minDate: moment.Moment;
  public maxDate: moment.Moment;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public disableMinute = false;
  public hideTime = false;
  public color = 'accent';

  public dateControl = new FormControl(new Date());

  str_date = '';

  isEdit: boolean = false;
  isToMember: boolean = false;
  
  constructor(private leadsService: LeadsService, private userService: UserService, private tokenStorageService: TokenStorageService, private ref: MatDialogRef<DlgLeadsDetailComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, public dialog: MatDialog) { 
    this.userInfo_member = this.tokenStorageService.getUser_member();
  }

  ngOnInit(): void {
    this.getTeamListAll();

    this.getLeadById(this.data.selId);

    this.getLeadTypeList();

    this.getLeadStatusList();
  }

  getLeadById(selId) {
    
    this.leadsService.getLeadById(selId).subscribe(
      data => {
        // this.leadInfo = data[0];

        // this.commentList = data[0].comment_list;
        this.leadInfo._id = data[0]._id;
        this.leadInfo.first_name = data[0].first_name ? data[0].first_name : "";
        this.leadInfo.last_name = data[0].last_name ? data[0].last_name : "";
        this.leadInfo.email = data[0].email ? data[0].email : "";
        this.leadInfo.phone = data[0].phone ? data[0].phone : "";
        this.leadInfo.byTeam = data[0].byTeam ? data[0].byTeam : null;
        this.leadInfo.team_member = data[0].team_member ? data[0].team_member : [];
        this.leadInfo.status = data[0].status ? data[0].status : null;
        this.leadInfo.lead_status = data[0].lead_status ? data[0].lead_status : [];
        this.leadInfo.comment = data[0].comment ? data[0].comment : "";
        this.leadInfo.comment_list = data[0].comment_list ? data[0].comment_list : [];
        this.leadInfo.contact_again = data[0].contact_again ? data[0].contact_again : "";
        this.leadInfo.type = data[0].type ? data[0].type : null;
        this.leadInfo.subtype = data[0].subtype ? data[0].subtype : null;
        this.leadInfo.lead_type = data[0].lead_type ? data[0].lead_type : [];
        this.leadInfo.lead_subtype = data[0].lead_subtype ? data[0].lead_subtype : [];
        this.leadInfo.accepted = data[0].accepted ? data[0].accepted : "0";
        this.leadInfo.perm_email = data[0].perm_email ? data[0].perm_email : "0";
        this.leadInfo.perm_phone = data[0].perm_phone ? data[0].perm_phone : "0";
        this.leadInfo.perm_text = data[0].perm_text ? data[0].perm_text : "0";
        this.leadInfo.role = data[0].role;

        this.commentList = this.leadInfo.comment_list;

        var dTmp = new Date(this.leadInfo.contact_again);
        if(this.leadInfo.contact_again == "") dTmp = new Date();
        
        this.str_date = dTmp.getFullYear() + "-" + this.addZero(dTmp.getMonth() + 1) + "-" + this.addZero(dTmp.getDate()) + " " + this.addZero(dTmp.getHours()) + ":" + this.addZero(dTmp.getMinutes()) + ":" + this.addZero(dTmp.getSeconds());
        this.leadInfo.contact_again = this.str_date;
        this.date = moment({ y: dTmp.getFullYear(), M: dTmp.getMonth(), d: dTmp.getDate(), h: dTmp.getHours(), m: dTmp.getMinutes(), s: dTmp.getSeconds(), ms: dTmp.getMilliseconds()}); 
      },
      err => {
        this.showErrorMsg(err);
      }
    )
  }

  getTeamListAll() {
    this.userService.getTeamListAll().subscribe(
      data => {
        this.teamList = data.items;
      },
      err => {
        this.showErrorMsg(err);
      }
    )
  }

  getLeadTypeList() {
    this.leadsService.getLeadTypeList().subscribe(
      data => {
        this.typeList = data;

        this.getLeadSubTypeList(this.leadInfo.type);
      },
      err => {
        this.showErrorMsg(err);
      }
    )
  }

  getLeadSubTypeList(typeId: string) {
    this.leadsService.getLeadSubTypeList(typeId).subscribe(
      data => {
        this.subtypeList = data;
      },
      err => {
        this.showErrorMsg(err);
      }
    )
  }

  getLeadStatusList() {
    this.leadsService.getLeadStatusList().subscribe(
      data => {
        this.statusList = data;
      },
      err => {
        this.showErrorMsg(err);
      }
    )
  }

  onChangeMember(event) {
    this.leadInfo.byTeam = event.value;
  }

  onChangeStatus(event) {
    this.leadInfo.status = event.value;
  }

  onChangeType(event) {
    this.getLeadSubTypeList(event.value);

    this.leadInfo.type = event.value;
  }

  onChangeSubType(event) {
    this.leadInfo.subtype = event.value;
  }

  showComment() {
    this.show_comment = true;
  }

  mongoObjectId() {
    var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
  };

  saveCommnet() {
    var dTmp = new Date();
    var strd = dTmp.getFullYear() + "-" + this.addZero(dTmp.getMonth() + 1) + "-" + this.addZero(dTmp.getDate()) + "T" + this.addZero(dTmp.getHours()) + ":" + this.addZero(dTmp.getMinutes()) + ":" + this.addZero(dTmp.getSeconds()) + "." + dTmp.getMilliseconds();

    this.leadInfo.comment = this.str_comment;
    this.leadInfo.comment_list.push({_id: this.mongoObjectId(), date: strd, comment: this.str_comment, team_member: this.userInfo_member.first_name + ' ' + this.userInfo_member.last_name});

    this.commentList = [...this.leadInfo.comment_list];

    this.str_comment = '';

    console.log(this.commentList);
  }

  editComment(selId) {

  }

  deleteComment(selId) {
    var index = 0;
    this.leadInfo.comment_list.forEach((element, key) => {
      if(element._id == selId) {
        index = key;
      }
    });

    this.leadInfo.comment_list.splice(index, 1);

    this.commentList = [...this.leadInfo.comment_list];
  }

  getDate(strDate) {
    if(strDate == "") return "";
    var tmp = strDate.split("T");
    if(tmp.length == 1) return tmp[0];

    var time = tmp[1].split(".");

    return tmp[0] + ' ' + time[0];
  }

  addZero(n) {
    if(n < 10) return "0" + n;
    else return n;
  }

  ngAfterViewChecked() {
    this.dateControl.valueChanges.subscribe((value: any) => {
      var selDateTimeVal = this.dateControl.value._d.getFullYear() + "-" + this.addZero(this.dateControl.value._d.getMonth() + 1) + "-" + this.addZero(this.dateControl.value._d.getDate()) + " " + this.addZero(this.dateControl.value._d.getHours()) + ":" + this.addZero(this.dateControl.value._d.getMinutes()) + ":" + this.addZero(this.dateControl.value._d.getSeconds());

      this.leadInfo.contact_again = selDateTimeVal;
    })
  }

  phoneChecked(checked: boolean) {
    var perm = checked ? "1" : "0";
    this.leadInfo.perm_phone = perm;
  }

  emailChecked(checked: boolean) {
    var perm = checked ? "1" : "0";
    this.leadInfo.perm_email = perm;
  }

  textChecked(checked: boolean) {
    var perm = checked ? "1" : "0";
    this.leadInfo.perm_text = perm;
  }

  showSuccessMsg(strMsg) {
    this.successMsg = strMsg;

    setTimeout(() => {
      this.successMsg = null;
      this.ref.close("success");
    }, 3000);
  }

  showErrorMsg(strMsg) {
    this.error = strMsg;

    setTimeout(() => this.error = null, 5000);
  }

  edit_btn() {
    this.isEdit = true;
  }

  save_btn() {
    this.isEdit = false;

    this.leadsService.editLead(JSON.stringify(this.leadInfo)).subscribe(
      data => {
        console.log(data);
        if(data.status == "success")
          this.showSuccessMsg(data.msg);
        else 
          this.showErrorMsg(data.msg);
      },
      err => {
        this.showErrorMsg(err);
      }
    )
  }

  cancel_btn() {
    this.ref.close("success");
  }

  changeToMember(selId) {
    this.leadInfo.role = "Member";

    let data: ConfirmDialogData = {
      msg: 'Do you want to change to "Team Member" this lead?'
    }

    this.dialog.open<DlgConfirmComponent>(DlgConfirmComponent, {data: data})
      .afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        if(result) {
          this.leadsService.changeToMember(selId).subscribe(
            data => {
              this.showSuccessMsg("Request send to this lead.");
            },
            err => {
              this.showErrorMsg(err.message);
            }
          )
        }
      });
  }
}

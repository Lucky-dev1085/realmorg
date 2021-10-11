import { Component, Inject, OnInit } from '@angular/core';
import { LeadsService } from '../../_services/leads.service';
import { UserService } from '../../_services/user.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';

interface DialogData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  byTeam: string;
  status: string;
  comment: string;
  comment_list: Array<any>,
  contact_again: any,
  type: string;
  subtype: string;
  accepted: string;
  perm_phone: string;
  perm_email: string;
  perm_text: string;
}

@Component({
  selector: 'app-dlg-create-lead',
  templateUrl: './dlg-create-lead.component.html',
  styleUrls: ['./dlg-create-lead.component.css']
})
export class DlgCreateLeadComponent implements OnInit {

  displayedColumns: string[] = ['date', 'team_member', 'comment'];
  teamList = [];
  error: string;
  successMsg: string;
  userInfo_member: any;
  leadInfo = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    byTeam: '',
    status: null,
    comment: '',
    comment_list: [],
    contact_again: '',
    type: null,
    subtype: null,
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
  
  constructor(private leadsService: LeadsService, private userService: UserService, private tokenStorageService: TokenStorageService, private ref: MatDialogRef<DlgCreateLeadComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { 
    this.userInfo_member = this.tokenStorageService.getUser_member();
  }

  ngOnInit(): void {
    this.leadInfo.first_name = this.data.first_name;
    this.leadInfo.last_name = this.data.last_name;
    this.leadInfo.email = this.data.email;
    this.leadInfo.phone = this.data.phone;
    this.leadInfo.byTeam = this.data.byTeam;
    this.leadInfo.status = this.data.status;
    this.leadInfo.comment = this.data.comment;
    this.leadInfo.comment_list = this.data.comment_list;
    this.leadInfo.contact_again = this.data.contact_again;
    this.leadInfo.type = this.data.type;
    this.leadInfo.subtype = this.data.subtype;
    this.leadInfo.accepted = this.data.accepted;
    this.leadInfo.perm_email = this.data.perm_email;
    this.leadInfo.perm_phone = this.data.perm_phone;
    this.leadInfo.perm_text = this.data.perm_text;

    var dTmp = new Date(this.leadInfo.contact_again);
    this.str_date = dTmp.getFullYear() + "-" + this.addZero(dTmp.getMonth() + 1) + "-" + this.addZero(dTmp.getDate()) + " " + this.addZero(dTmp.getHours()) + ":" + this.addZero(dTmp.getMinutes()) + ":" + this.addZero(dTmp.getSeconds());
    console.log(this.str_date);
    this.date = moment({ y: dTmp.getFullYear(), M: dTmp.getMonth(), d: dTmp.getDate(), h: dTmp.getHours(), m: dTmp.getMinutes(), s: dTmp.getSeconds(), ms: dTmp.getMilliseconds()}); 

    this.getTeamListAll();

    this.getLeadTypeList();

    this.getLeadStatusList();
  }

  getTeamListAll() {
    this.userService.getTeamListAll().subscribe(
      data => {
        this.teamList = data.items;
      },
      err => {
        this.error = err.message;
      }
    )
  }

  getLeadTypeList() {
    this.leadsService.getLeadTypeList().subscribe(
      data => {
        this.typeList = data;

        // this.getLeadSubTypeList(this.leadInfo.type);
      },
      err => {
        this.error = err.message;
      }
    )
  }

  getLeadSubTypeList(typeId: string) {
    this.leadsService.getLeadSubTypeList(typeId).subscribe(
      data => {
        this.subtypeList = data;
      },
      err => {
        this.error = err.message;
      }
    )
  }

  getLeadStatusList() {
    this.leadsService.getLeadStatusList().subscribe(
      data => {
        this.statusList = data;
      },
      err => {
        this.error = err.message;
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
    this.leadInfo.comment_list.push({_id: this.mongoObjectId(), date: strd, comment: this.str_comment, team_member: this.userInfo_member.first_name + ' ' + this.userInfo_member.last_name})

    this.commentList = [...this.leadInfo.comment_list];

    console.log(this.commentList);

    this.str_comment = '';
  }

  getDate(strDate) {
    var tmp = strDate.split("T");
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

  save_btn() {
    console.log(this.leadInfo);
    this.leadsService.createNewLead(JSON.stringify(this.leadInfo)).subscribe(
      data => {
        console.log(data);

        this.showSuccessMsg("Created New Lead");
      },
      err => {
        this.showErrorMsg(err);
      }
    )
  }

  cancel_btn() {
    this.ref.close();
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

}

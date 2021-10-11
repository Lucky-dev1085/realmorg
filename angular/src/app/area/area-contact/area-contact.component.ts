import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DlgAlertComponent } from '../../components/dlg-alert/dlg-alert.component';
import { LeadsService } from '../../_services/leads.service';
declare var $;

interface AlertData {
  msg: string;
}

@Component({
  selector: 'app-area-contact',
  templateUrl: './area-contact.component.html',
  styleUrls: ['./area-contact.component.css']
})
export class AreaContactComponent implements OnInit {

  @Input() city: string = "";
  @Input() district: string = "";
  @Input() community: string = "";
  
  errMsg: string;

  member_address: string = '4656 Westwinds Dr NE #601, Calgary, AB T3J 3Z5';
  phone_list = [
    {phone_number: '403-807-1616', description: 'cell'}
  ];

  str_first_name: string = '';
  str_last_name: string = '';
  str_email: string = '';
  str_phone: string = '';
  str_msg: string = '';

  addMessage: boolean = false;

  typeList = [];
  subtypeList = [];

  str_type: string = null;
  str_subtype: string = null;
  isDisable: boolean = true;
  perm: boolean = false;

  constructor(private leadsService: LeadsService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getLeadTypeList();
  }

  request_detail() {
    var address = "";
    
    if(this.community != "") address += this.community + ", ";
    if(this.district != '') address += this.district + ", ";
    address += this.city;

    this.leadsService.saveLeads('area', address, this.str_first_name, this.str_last_name, this.str_email, this.str_phone, this.str_msg, this.str_type, this.str_subtype).subscribe(
      data => {
        console.log(data);
        let alert_data: AlertData = {
          msg: 'Request send success!'
        }
    
        this.dialog.open<DlgAlertComponent>(DlgAlertComponent, {data: alert_data})
          .afterClosed().subscribe(result => {
            console.log('The dialog was closed', result);
            if(result) {
            }
          });
      },
      err => {
        this.errMsg = err.message;
      }
    )
  }

  inputChange(newVal) {
    if(this.str_first_name != '' && this.str_last_name != '' && this.str_email != '' && this.str_phone != '' && this.str_type != null && this.str_subtype != null && this.perm) {
      this.isDisable = false;
    } else {
      this.isDisable = true;
    }
  }

  showMessage() {
    this.addMessage = true;
  }

  getLeadTypeList() {
    this.leadsService.getLeadTypeList().subscribe(
      data => {
        this.typeList = data;

        this.getLeadSubTypeList(this.typeList[0]['_id']);
      },
      err => {
        this.errMsg = err.message;
      }
    )
  }

  getLeadSubTypeList(typeId: string) {
    this.leadsService.getLeadSubTypeList(typeId).subscribe(
      data => {
        this.subtypeList = data;
      },
      err => {
        this.errMsg = err.message;
      }
    )
  }

  onChangeType(event) {
    this.getLeadSubTypeList(event.value);

    if(this.str_first_name != '' && this.str_last_name != '' && this.str_email != '' && this.str_phone != '' && this.str_type != null && this.str_subtype != null && this.perm) {
      this.isDisable = false;
    } else {
      this.isDisable = true;
    }
  }

  onChangeSubType(event) {
    if(this.str_first_name != '' && this.str_last_name != '' && this.str_email != '' && this.str_phone != '' && this.str_type != null && this.str_subtype != null && this.perm) {
      this.isDisable = false;
    } else {
      this.isDisable = true;
    }
  }

  permChecked(checked: boolean) {
    this.perm = checked;

    if(this.str_first_name != '' && this.str_last_name != '' && this.str_email != '' && this.str_phone != '' && this.str_type != null && this.str_subtype != null && this.perm) {
      this.isDisable = false;
    } else {
      this.isDisable = true;
    }
  }

}

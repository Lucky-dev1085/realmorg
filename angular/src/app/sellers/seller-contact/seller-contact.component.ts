import { Component, Input, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { Router } from "@angular/router";
import { LeadsService } from '../../_services/leads.service';
import { MatDialog } from '@angular/material/dialog';
import { DlgAlertComponent } from '../../components/dlg-alert/dlg-alert.component';

interface AlertData {
  msg: string;
}

@Component({
  selector: 'app-seller-contact',
  templateUrl: './seller-contact.component.html',
  styleUrls: ['./seller-contact.component.css']
})
export class SellerContactComponent implements OnInit {

  @Input() address: string = '';
  @Input() city: string = '';
  
  errMsg: string;
  
  selectedwhy: string = '';

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

  firstName = new FormControl('', [Validators.required]);

  getFirstNameErrorMessage() {
    if (this.firstName.hasError('required')) {
      return 'You must enter your First Name';
    }
    return '';
  }

  lastName = new FormControl('', [Validators.required]);

  getLastNameErrorMessage() {
    if (this.lastName.hasError('required')) {
      return 'You must enter your Last Name';
    }
    return '';
  }

  phone = new FormControl('', [Validators.required]);

  getPhoneErrorMessage() {
    if (this.phone.hasError('required')) {
      return 'You must enter your Phone Number';
    }
    return '';
  }

  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter your email';
    } else if (this.email.hasError('email')) {
      return 'Not a valid email';
    }

    return '';
  }

  constructor(private leadsService: LeadsService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getLeadTypeList();
  }

  getHomeValue() {
    // if ((this.str_first_name == '') || (this.str_last_name == '') || (this.str_phone == '') || (this.str_email == '')) return;

    if(this.getFirstNameErrorMessage() != '') {  return;}
    if(this.getLastNameErrorMessage() != '') return;
    if(this.getPhoneErrorMessage() != '') return;
    if(this.getErrorMessage() != '') return;

    this.leadsService.saveLeads("seller", this.address, this.str_first_name, this.str_last_name, this.str_email, this.str_phone, "", this.str_type, this.str_subtype).subscribe(
      data => {
        console.log(data);
        let alert_data: AlertData = {
          msg: 'Request send success!'
        }
    
        this.dialog.open<DlgAlertComponent>(DlgAlertComponent, {data: alert_data})
          .afterClosed().subscribe(result => {
            console.log('The dialog was closed', result);
            if(result) {
              this.router.navigate(['/sellers/get-home-value'], { queryParams: { 
                city: this.city
              } }
              );
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

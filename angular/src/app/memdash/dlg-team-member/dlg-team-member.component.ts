import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RESOURCE_URL } from '../../_services/endPoint';
import { UserService } from '../../_services/user.service';

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

@Component({
  selector: 'app-dlg-team-member',
  templateUrl: './dlg-team-member.component.html',
  styleUrls: ['./dlg-team-member.component.css']
})
export class DlgTeamMemberComponent implements OnInit {

  @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;
  fileUploadForm: FormGroup;
  fileInputLabel: string;

  resourceURL = RESOURCE_URL;

  file: File;

  imageUrl: string | ArrayBuffer = "https://bulma.io/images/placeholders/480x480.png";
  fileName: string = "No file selected";
  
  error: string;
  successMsg: string;

  str_first_name: string;
  str_last_name: string;
  str_type: string;
  str_email: string;
  str_cell_phone: string;
  str_office_phone: string;
  str_avatar: string;
  str_address: string;
  str_content: string;

  typeList = [
    { value: 'Realtor', viewValue: 'Realtor'},
    { value: 'Mortgage Broker', viewValue: 'Mortgage Broker'},
  ]

  constructor(private ref: MatDialogRef<DlgTeamMemberComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private userService: UserService, private formBuilder: FormBuilder, private http: HttpClient) { 
    this.str_first_name = this.data.first_name;
    this.str_last_name = this.data.last_name;
    this.str_type = this.data.type;
    this.str_email = this.data.email;
    this.str_cell_phone = this.data.cell_phone;
    this.str_office_phone = this.data.office_phone;
    this.str_avatar = this.data.avatar;
    this.str_address = this.data.address;
    this.str_content = this.data.content;

    if(this.str_avatar != '') this.imageUrl = this.resourceURL + "TeamMember/" + this.str_avatar;

    this.fileUploadForm = this.formBuilder.group({
      uploadedImage: ['']
    });
  }

  ngOnInit(): void {
  }

  save_btn() {
    this.onFormSubmit();
  }

  onFileSelect(event) {
    const file = event.target.files[0];
    this.fileInputLabel = file.name;
    this.fileUploadForm.get('uploadedImage').setValue(file);
  }


  onFormSubmit() {

    if (!this.fileUploadForm.get('uploadedImage').value) {
      // alert('Please fill valid details!');
      // if(this.str_url != "") {
        this.userService.saveMember(this.data.selId, this.str_first_name, this.str_last_name, this.str_type, this.str_email, this.str_cell_phone, this.str_office_phone, this.str_avatar, this.str_address, this.str_content).subscribe(
          data => {
            if(data.status == "success") {
              if(this.data.selId == '') this.showSuccessMsg("Created New Team Member");
              else this.showSuccessMsg("Saved Member");
            }
            else {
              this.showErrorMsg(data.msg);
            }
          },
          err => {
            this.error = err.message;
          }
        )
      // }
      return false;
    }

    const formData = new FormData();
    formData.append('uploadedImage', this.fileUploadForm.get('uploadedImage').value);
    formData.append('agentId', '007');


    this.http
      .post<any>(this.resourceURL + 'uploadMemberAvatar', formData).subscribe(response => {
        console.log(response);
        if (response.statusCode === 200) {
          // Reset the file input
          this.uploadFileInput.nativeElement.value = "";
          this.fileInputLabel = undefined;

          this.str_avatar = response.uploadedFile.filename;

          this.userService.saveMember(this.data.selId, this.str_first_name, this.str_last_name, this.str_type, this.str_email, this.str_cell_phone, this.str_office_phone, this.str_avatar, this.str_address, this.str_content).subscribe(
            data => {
              if(data.status == "success") {
                if(this.data.selId == '') this.showSuccessMsg("Created New Team Member");
                else this.showSuccessMsg("Saved Member");
              }
              else {
                this.showErrorMsg(data.msg);
              }
            },
            err => {
              this.error = err.message;
            }
          )
        }
      }, er => {
        console.log(er);
        // alert(er.error.error);

        this.str_avatar = "";

        this.userService.saveMember(this.data.selId, this.str_first_name, this.str_last_name, this.str_type, this.str_email, this.str_cell_phone, this.str_office_phone, this.str_avatar, this.str_address, this.str_content).subscribe(
          data => {
            if(data.status == "success") {
              if(this.data.selId == '') this.showSuccessMsg("Created New Team Member");
              else this.showSuccessMsg("Saved Member");
            }
            else {
              this.showErrorMsg(data.msg);
            }
          },
          err => {
            this.error = err.message;
          }
        )
      });
  }

  onChange(file: File) {
    if (file) {
      this.fileName = file.name;
      this.file = file;

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = event => {
        this.imageUrl = reader.result;
      };
    }
  }

  // save_btn() {
  //   this.userService.saveMember(this.data.selId, this.str_first_name, this.str_last_name, this.str_type, this.str_email, this.str_cell_phone, this.str_office_phone, this.str_avatar, this.str_address, this.str_content).subscribe(
  //     data => {
  //       if(data.status == "success") {
  //         if(this.data.selId == '') this.showSuccessMsg("Created New Team Member");
  //         else this.showSuccessMsg("Saved Member");
  //       }
  //       else {
  //         this.showErrorMsg(data.msg);
  //       }
  //     },
  //     err => {
  //       this.error = err.message;
  //     }
  //   )
  // }

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

import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { RESOURCE_URL } from '../../_services/endPoint';

import { PropertyService } from '../../_services/property.service';

interface DialogData {
  city: string;
  district: string;
  subdivisionName: string;
  style: string;
  type: string;
  order_num: number,
  content: string
}

@Component({
  selector: 'app-dialog-metacontent',
  templateUrl: './dialog-metacontent.component.html',
  styleUrls: ['./dialog-metacontent.component.css']
})
export class DialogMetacontentComponent implements OnInit {

  @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;
  fileUploadForm: FormGroup;
  fileInputLabel: string;
  
  str_title: string = "";
  str_url: string = '';
  str_keyword: string = '';
  str_description: string = '';
  str_socialdescription: string = '';

  errMsg: string = '';

  resourceURL = RESOURCE_URL;

  file: File;

  imageUrl: string | ArrayBuffer = "https://bulma.io/images/placeholders/480x480.png";
  fileName: string = "No file selected";

  constructor(
    private ref: MatDialogRef<DialogMetacontentComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: DialogData, 
    private propertyService: PropertyService, 
    private http: HttpClient,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    if(this.data.type == "edit") {
      var content = JSON.parse(this.data.content);
      var metaContent = content.metaContent;
      var socialMedia = content.socialMedia;

      this.str_title = metaContent.title;
      this.str_url = metaContent.url;
      this.str_keyword = metaContent.keyword;
      this.str_description = metaContent.description;
      this.str_socialdescription = socialMedia.socialdescription;

      this.imageUrl = this.resourceURL + "PageContent/" + this.str_url;
    }

    this.fileUploadForm = this.formBuilder.group({
      uploadedImage: ['']
    });
  }

  save_btn() {
    this.onFormSubmit();
  }

  cancel_btn() {
    this.ref.close();
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
        this.propertyService.saveMetaContent(this.data.city, this.data.district, this.data.subdivisionName, this.str_title, this.str_url, this.str_keyword, this.str_description, this.str_socialdescription, this.data.style, this.data.type, this.data.order_num).subscribe(
          data => {
            this.ref.close(data);
          },
          err => {
            this.errMsg = err.message;
          }
        )
      // }
      return false;
    }

    const formData = new FormData();
    formData.append('uploadedImage', this.fileUploadForm.get('uploadedImage').value);
    formData.append('agentId', '007');


    this.http
      .post<any>(this.resourceURL + 'uploadfile', formData).subscribe(response => {
        console.log(response);
        if (response.statusCode === 200) {
          // Reset the file input
          this.uploadFileInput.nativeElement.value = "";
          this.fileInputLabel = undefined;

          this.str_url = response.uploadedFile.filename;

          this.propertyService.saveMetaContent(this.data.city, this.data.district, this.data.subdivisionName, this.str_title, this.str_url, this.str_keyword, this.str_description, this.str_socialdescription, this.data.style, this.data.type, this.data.order_num).subscribe(
            data => {
              this.ref.close(data);
            },
            err => {
              this.errMsg = err.message;
            }
          )
        }
      }, er => {
        console.log(er);
        // alert(er.error.error);

        this.str_url = "";

        this.propertyService.saveMetaContent(this.data.city, this.data.district, this.data.subdivisionName, this.str_title, this.str_url, this.str_keyword, this.str_description, this.str_socialdescription, this.data.style, this.data.type, this.data.order_num).subscribe(
          data => {
            this.ref.close(data);
          },
          err => {
            this.errMsg = err.message;
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

}

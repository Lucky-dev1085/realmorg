import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  selector: 'app-dialog-alcontent',
  templateUrl: './dialog-alcontent.component.html',
  styleUrls: ['./dialog-alcontent.component.css']
})
export class DialogAlcontentComponent implements OnInit {

  str_heading: string = '';
  str_subheading: string = '';
  str_content: string = '';

  errMsg: string = '';

  constructor(private ref: MatDialogRef<DialogAlcontentComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private propertyService: PropertyService) { }

  ngOnInit(): void {
    if(this.data.type == "edit") {
      var content = JSON.parse(this.data.content);

      this.str_heading = content.heading;
      this.str_subheading = content.subheading;
      this.str_content = content.paragraph_content;
    }
  }

  save_btn() {
    this.propertyService.savePageContent(this.data.city, this.data.district, this.data.subdivisionName, this.str_heading, this.str_subheading, this.str_content, this.data.style, this.data.type, this.data.order_num).subscribe(
      data => {
        this.ref.close(data);
      },
      err => {
        this.errMsg = err.message;
      }
    )
  }

  cancel_btn() {
    this.ref.close();
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Title, Meta } from '@angular/platform-browser';

import { BasicLookupService } from '../../_services/basiclookup.service';
import { PropertyService } from '../../_services/property.service';
import { DialogAlcontentComponent } from '../dialog-alcontent/dialog-alcontent.component';
import { DialogBlcontentComponent } from '../dialog-blcontent/dialog-blcontent.component';
import { DialogMetacontentComponent } from '../dialog-metacontent/dialog-metacontent.component';

import { RESOURCE_URL } from '../../_services/endPoint';

interface City {
  value: string;
  viewValue: string;
};

interface District {
  value: string;
  viewValue: string;
};

interface SubdivisionName {
  value: string;
  viewValue: string;
  district: string;
};

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
  selector: 'app-page-content',
  templateUrl: './page-content.component.html',
  styleUrls: ['./page-content.component.css']
})
export class PageContentComponent implements OnInit {

  resourceURL = RESOURCE_URL;
  
  errMsg: string = "";

  selectedCity: string = "Calgary";

  CityList: City[] = [
    {value: 'HomePageContent', viewValue: 'HomePageContent'},
    {value: 'Calgary', viewValue: 'Calgary'},
    {value: 'Airdrie', viewValue: 'Airdrie'},
    {value: 'Chestermere', viewValue: 'Chestermere'},
  ];

  selectedDistrict: string = "";
  DistrictList: District[] = [];

  selectedSubdivisionName: string = "";
  SubdivisionNameList: SubdivisionName[];

  beforeContent = [];
  afterContent = [];
  metaContent = {
    title: '',
    url: '',
    keyword: '',
    description: ''
  };
  socialMedia = {
    description: ''
  }

  filterCondition: any = {};

  constructor(private basicLookupService: BasicLookupService, private propertyService: PropertyService, public dialog: MatDialog, private titleService: Title, private metaService: Meta) { }

  ngOnInit(): void {
    this.titleService.setTitle("Page Content");
    this.metaService.addTags([
      {name: 'description', content: 'This is an example of a meta description. This will often show up in search results.'}
    ]);

    this.filterCondition = {
      "city": this.selectedCity,
      "district": this.selectedDistrict,
      "subdivisionName": this.selectedSubdivisionName
    };

    this.getDistrictByCity();
  }

  getDistrictByCity() {
    this.basicLookupService.getDistrictByCity(this.selectedCity).subscribe(
      data => {
        this.DistrictList = data;

        this.selectedDistrict = "";

        this.getSubdivisionNameListByCityAndDistrict();
      },
      err => {
        this.errMsg = JSON.parse(err.error).message;
      }
    );
  }

  getSubdivisionNameListByCityAndDistrict() {
    this.basicLookupService.getSubdivisionNameListByCityAndDistrict(this.selectedCity, this.selectedDistrict).subscribe(
      data => {
        this.SubdivisionNameList = data;

        this.selectedSubdivisionName = "";

        this.filterCondition = {
          "city": this.selectedCity,
          "district": this.selectedDistrict,
          "subdivisionName": this.selectedSubdivisionName
        };

        this.getPageContent(this.filterCondition);
      },
      err => {
        this.errMsg = JSON.parse(err.error).message;
      }
    );
  }

  onChangeCity(newValue) {
    this.getDistrictByCity();
  }

  onChangeDistrict(newValue) {
    this.getSubdivisionNameListByCityAndDistrict();
  }

  onChangeSubdivisionName(newValue) {
    this.filterCondition = {
      "city": this.selectedCity,
      "district": this.selectedDistrict,
      "subdivisionName": this.selectedSubdivisionName
    };

    this.getPageContent(this.filterCondition);
  }

  getPageContent(filterCondition: Object) {
    this.propertyService.getPageContent(filterCondition).subscribe(
      data => {
        if(data.length != 0) {
          this.beforeContent = data[0].before_listing_content;
          this.afterContent = data[0].after_listing_content;
          this.metaContent = data[0].meta_content;
          this.socialMedia = data[0].social_media;
        } else {
          this.beforeContent = [];
          this.afterContent = [];
          this.metaContent = {
            title: '',
            url: '',
            keyword: '',
            description: ''
          };
          this.socialMedia = {
            description: ''
          };
        }
      },
      err => {
        this.errMsg = err.message;
      }
    )
  }

  addMetaContent() {
    let data: DialogData = {
      city: this.selectedCity,
      district: this.selectedDistrict,
      subdivisionName: this.selectedSubdivisionName,
      style: 'meta',
      type: 'add',
      order_num: 0,
      content: ''
    }

    this.dialog.open<DialogMetacontentComponent,DialogData>(DialogMetacontentComponent, { width: '800px', data })
      .afterClosed().subscribe(result => {
      this.getPageContent(this.filterCondition);
    });
  }

  editMetaContent() {
    let data: DialogData = {
      city: this.selectedCity,
      district: this.selectedDistrict,
      subdivisionName: this.selectedSubdivisionName,
      style: 'meta',
      type: 'edit',
      order_num: 0,
      content: JSON.stringify({metaContent: this.metaContent, socialMedia: this.socialMedia})
    }

    this.dialog.open<DialogMetacontentComponent,DialogData>(DialogMetacontentComponent, { width: '800px', data })
      .afterClosed().subscribe(result => {
      this.getPageContent(this.filterCondition);
    });
  }

  clearMetaContent() {
    this.propertyService.clearPageContent(this.selectedCity, this.selectedDistrict, this.selectedSubdivisionName, 'meta', 0).subscribe(
      data => {
        this.getPageContent(this.filterCondition);
      },
      err => {
        this.errMsg = err.message;
      }
    )
  }

  addBlContent() {
    let data: DialogData = {
      city: this.selectedCity,
      district: this.selectedDistrict,
      subdivisionName: this.selectedSubdivisionName,
      style: 'before',
      type: 'add',
      order_num: this.beforeContent.length,
      content: ''
    }

    this.dialog.open<DialogBlcontentComponent,DialogData>(DialogBlcontentComponent, { width: '800px', data })
      .afterClosed().subscribe(result => {
      this.getPageContent(this.filterCondition);
    });
  }

  editBlContent(key) {
    let data: DialogData = {
      city: this.selectedCity,
      district: this.selectedDistrict,
      subdivisionName: this.selectedSubdivisionName,
      style: 'before',
      type: 'edit',
      order_num: key,
      content: JSON.stringify(this.beforeContent[key])
    }

    this.dialog.open<DialogBlcontentComponent,DialogData>(DialogBlcontentComponent, { width: '800px', data })
      .afterClosed().subscribe(result => {
        this.getPageContent(this.filterCondition);
      });
  }

  clearBlContent(key) {
    this.propertyService.clearPageContent(this.selectedCity, this.selectedDistrict, this.selectedSubdivisionName, 'before', key).subscribe(
      data => {
        this.getPageContent(this.filterCondition);
      },
      err => {
        this.errMsg = err.message;
      }
    )
  }

  addAlContent() {
    let data: DialogData = {
      city: this.selectedCity,
      district: this.selectedDistrict,
      subdivisionName: this.selectedSubdivisionName,
      style: 'after',
      type: 'add',
      order_num: this.afterContent.length,
      content: ''
    }

    this.dialog.open<DialogAlcontentComponent,DialogData>(DialogAlcontentComponent, { data })
      .afterClosed().subscribe(result => {
        this.getPageContent(this.filterCondition);
      });
  }

  editAlContent(key) {
    let data: DialogData = {
      city: this.selectedCity,
      district: this.selectedDistrict,
      subdivisionName: this.selectedSubdivisionName,
      style: 'after',
      type: 'edit',
      order_num: key,
      content: JSON.stringify(this.afterContent[key])
    }

    this.dialog.open<DialogAlcontentComponent,DialogData>(DialogAlcontentComponent, { width: '800px', data })
      .afterClosed().subscribe(result => {
        this.getPageContent(this.filterCondition);
      });
  }

  clearAlContent(key) {
    this.propertyService.clearPageContent(this.selectedCity, this.selectedDistrict, this.selectedSubdivisionName, 'after', key).subscribe(
      data => {
        this.getPageContent(this.filterCondition);
      },
      err => {
        this.errMsg = err.message;
      }
    )
  }

}


// @Component({
//   selector: 'dialog-blcontent',
//   templateUrl: './dialog-blcontent.html',
// })
// export class DialogBlContent {
//   constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
// }

// @Component({
//   selector: 'dialog-alcontent',
//   templateUrl: './dialog-alcontent.html',
// })
// export class DialogAlContent {
//   constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
// }
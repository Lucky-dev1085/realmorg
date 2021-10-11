import { Component, OnInit, EventEmitter, Output, AfterViewInit, Input } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { PropertyService } from '../../../../_services/property.service';

import { RESOURCE_URL, SERVER_URL } from '../../../../_services/endPoint';

@Component({
  selector: 'app-community-list-view',
  templateUrl: './community-list-view.component.html',
  styleUrls: ['./community-list-view.component.css']
})
export class CommunityListViewComponent implements OnInit {

  @Input() city: string = "";
  @Input() district: string = "";
  @Input() community: string = "";

  errMsg: string;

  DirectionList = [
    {value: 'CAL Zone NE', viewValue: 'Northeast', url: 'Calgary-NE'},
    {value: 'CAL Zone NW', viewValue: 'Northwest', url: 'Calgary-NW'},
    {value: 'CAL Zone SE', viewValue: 'Southeast', url: 'Calgary-SE'},
    {value: 'CAL Zone SW', viewValue: 'Southwest', url: 'Calgary-SW'},
    {value: 'CAL Zone N', viewValue: 'North', url: 'Calgary-N'},
    {value: 'CAL Zone E', viewValue: 'East', url: 'Calgary-E'},
    {value: 'CAL Zone W', viewValue: 'West', url: 'Calgary-W'},
    {value: 'CAL Zone S', viewValue: 'South', url: 'Calgary-S'},
    {value: 'CAL Zone CC', viewValue: 'Center', url: 'Calgary-CC'}
  ];

  direction: string = "";

  filterCondition: any = {};

  resourceURL = RESOURCE_URL;
  serverURL = SERVER_URL;

  // MatPaginator Inputs
  totalData = {
    totalRecord: 0,
    avgDOM: 0,
    minListPrice: 0,
    maxListPrice: 0,
    lastModify: new Date()
  };
  pageSize = 12;
  pageSizeOptions: number[] = [12, 24];

  // MatPaginator Output
  pageEvent: PageEvent;
  public searchResultArr = [];

  selectedSort: string = "";

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

  beforeContentString: string = JSON.stringify([]);
  afterContentString: string = JSON.stringify([]);
  metaContentString: string = JSON.stringify({
    title: '',
    url: '',
    keyword: '',
    description: ''
  });
  socialMediaString: string = JSON.stringify({description: ''});

  constructor(private propertyService: PropertyService) { }

  ngOnInit(): void {
    this.DirectionList.forEach(element => {
      if(element.value == this.district) this.direction = element.viewValue;
    });

    this.filterCondition = {
      "city": this.city,
      "district": this.district,
      "subdivisionName": this.community
    };

    this.getPropertyCalgarySearchResult(this.filterCondition, this.pageSize, 0);
    this.getPageContent(this.filterCondition);
  }

  getPropertyCalgarySearchResult(filterCondition: Object, limit: number, offset: number) {
    this.propertyService.getPropertyCalgarySearchResult(filterCondition, limit, offset).subscribe(
      data => {
        this.searchResultArr = data.result;
        this.totalData = data.data;
      },
      err => {
        this.errMsg = JSON.parse(err.error).message;
      }
    );
  }

  getPageContent(filterCondition: Object) {
    this.propertyService.getPageContent(filterCondition).subscribe(
      data => {
        if(data.length != 0) {
          this.beforeContent = data[0].before_listing_content;
          this.afterContent = data[0].after_listing_content;
          this.metaContent = data[0].meta_content;
          this.socialMedia = data[0].social_media;

          this.beforeContentString = JSON.stringify(this.beforeContent);
          this.afterContentString = JSON.stringify(this.afterContent);
          this.metaContentString = JSON.stringify(this.metaContent);
          this.socialMediaString = JSON.stringify(this.socialMedia);
        }
      },
      err => {
        this.errMsg = err.message;
      }
    )
  }

  addCommas(nStr) {
    nStr += '';
    if(nStr == '') return 0;
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? (parseInt(x[1]) == 0 ? '' : '.' + x[1].substring(0, 2)) : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }

  onPaginateChange($event) {
    this.pageSize = this.pageEvent.pageSize;
    this.getPropertyCalgarySearchResult(this.filterCondition, this.pageEvent.pageSize, this.pageEvent.pageIndex * this.pageEvent.pageSize);
  }

  gotoPropertyDetail(ListingKeyNumeric: string, city: string, subdivisionName: any, address: any) {
    // var community = subdivisionName.replaceAll(" ", "-");
    // community = community.replaceAll("/", "-");
    var community = subdivisionName.replace(/ |\//g, '-');
    if(community == "") community = "towns";
    // var fullAddress = address.replaceAll(" ", "-");
    // fullAddress = fullAddress.replaceAll("/", "-");
    // fullAddress = fullAddress.replaceAll("#", "");
    // fullAddress = fullAddress.replaceAll(",", "");
    var fullAddress = address.replace(/ |\//g, '-');
    fullAddress = fullAddress.replace(/#|,/g, '');
    window.open(this.serverURL + city + "/" + community+ "/" + fullAddress + "-" + ListingKeyNumeric);
  }

  onChangeSortBy(newVal) {
    
  }

}

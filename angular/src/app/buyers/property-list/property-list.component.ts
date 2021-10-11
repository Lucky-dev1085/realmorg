import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { PropertyService } from '../../_services/property.service';
import { RESOURCE_URL, SERVER_URL } from '../../_services/endPoint';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
})
export class PropertyListComponent implements OnInit {

  @Input() city: string = "";
  @Input() district: string = "";
  @Input() subdivisionName: string = "";

  errMsg: string;

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

  constructor(private propertyService: PropertyService) { }

  ngOnInit(): void {
    this.filterCondition = {
      "city": this.city,
      "district": this.district,
      "subdivisionName": this.subdivisionName
    };
    // this.getPropertyCalgarySearchResult(this.filterCondition, this.pageSize, 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.filterCondition = {
      "city": this.city,
      "district": this.district,
      "subdivisionName": this.subdivisionName
    };
    this.getPropertyCalgarySearchResult(this.filterCondition, this.pageSize, 0)
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

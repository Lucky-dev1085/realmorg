import { Component, OnInit, Input } from '@angular/core';
import { BasicLookupService } from '../../../../_services/basiclookup.service';
import { SERVER_URL } from '../../../../_services/endPoint';

interface Community {
  value: string;
  viewValue: string;
};

interface Town {
  value: string;
  viewValue: string;
};

@Component({
  selector: 'app-community-other-link',
  templateUrl: './community-other-link.component.html',
  styleUrls: ['./community-other-link.component.css']
})
export class CommunityOtherLinkComponent implements OnInit {

  @Input() city: string = "";
  @Input() district: string = "";
  @Input() community: string = "";

  serverURL = SERVER_URL;

  errMsg: string = '';

  DirectionList = [
    {value: 'CAL Zone NE', viewValue: 'North East', url: 'Calgary-NE'},
    {value: 'CAL Zone NW', viewValue: 'North West', url: 'Calgary-NW'},
    {value: 'CAL Zone SE', viewValue: 'South East', url: 'Calgary-SE'},
    {value: 'CAL Zone SW', viewValue: 'South West', url: 'Calgary-SW'},
    {value: 'CAL Zone N', viewValue: 'North', url: 'Calgary-N'},
    {value: 'CAL Zone E', viewValue: 'East', url: 'Calgary-E'},
    {value: 'CAL Zone W', viewValue: 'West', url: 'Calgary-W'},
    {value: 'CAL Zone S', viewValue: 'South', url: 'Calgary-S'},
    {value: 'CAL Zone CC', viewValue: 'Center', url: 'Calgary-CC'}
  ];

  CommunityList: Community[] = [];
  TownList: Town[] = [];

  direction: string = '';

  constructor(private basicLookupService: BasicLookupService) { }

  ngOnInit(): void {
    this.DirectionList.forEach(element => {
      if(element.value == this.district) this.direction = element.viewValue;
    });

    this.getSubdivisionNameListByCityAndDistrict();
  }

  getSubdivisionNameListByCityAndDistrict() {
    if(this.city == "Calgary") {
      this.basicLookupService.getCalgaryTownList().subscribe(
        data => {
          this.TownList = data;
        },
        err => {
          this.errMsg = JSON.parse(err.error).message;
        }
      );
    }

    this.basicLookupService.getSubdivisionNameListByCityAndDistrict(this.city, this.district).subscribe(
      data => {
        this.CommunityList = data;
      },
      err => {
        this.errMsg = JSON.parse(err.error).message;
      }
    );
    
  }

  getURL(newValue) {
    var sel_district = "";
    this.DirectionList.forEach(element => {
      if(newValue == element.value) sel_district = element.url;
    });

    if(sel_district != "") {
      // window.open(this.serverURL + this.city + "/" + sel_district);
      return this.city + "/" + sel_district;
    }

    // var community = newValue.replaceAll(" ", "-");
    // community = community.replaceAll("/", "-");
    var community = newValue.replace(/ |\//g, '-');

    if(this.district != "") {
      this.CommunityList.forEach(element => {
        if(element.value == newValue) sel_district = this.district;
      });
    }

    if (sel_district == "" && this.city == 'Calgary') {
      this.TownList.forEach(element => {
        if(element.value == newValue) sel_district = "";
      });
    }

    this.DirectionList.forEach(element => {
      if(sel_district == element.value) sel_district = element.url;
    });

    // console.log("------- ", sel_district, ' : ', community);
    if(community == "") 
      // window.open(this.serverURL + this.city);
      return this.city;
    else if (sel_district == "")
      // window.open(this.serverURL + this.city + "/" + community);
      return this.city + "/" + community;
    else 
      // window.open(this.serverURL + this.city + "/" + sel_district + "/" + community);
      return this.city + "/" + sel_district + "/" + community;
  }

}

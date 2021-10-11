import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { PropertyService } from '../../../../_services/property.service';
import { RESOURCE_URL, SERVER_URL } from '../../../../_services/endPoint';
import { DlgMapComponent } from '../dlg-map/dlg-map.component';
import { DlgShowGalleryConfirmComponent } from '../dlg-show-gallery-confirm/dlg-show-gallery-confirm.component';

interface DialogData {
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css'],
  providers: [
    NgbCarouselConfig
  ]
})
export class PropertyDetailComponent implements OnInit {

  resourceURL = RESOURCE_URL;
  serverURL = SERVER_URL;

  errMsg: string;

  City: string;
  Community: string;
  Address: string;
  ListingKeyNumeric: string;

  public propertyArr = {};
  public resourceArr = [];

  currentIndex: any = -1;
  showFlag: any = false;

  propertyRoomLevelsArr = [];
  propertyRoomsArr = [];
  similiarPropertyArr = [];

  constructor(private route: ActivatedRoute, private propertyService: PropertyService, config: NgbCarouselConfig, private titleService: Title, private metaService: Meta, @Inject(DOCUMENT) private dom, public dialog: MatDialog) { 
    // customize default values of carousels used by this component tree
    config.interval = 5000;
    config.keyboard = true;
    config.pauseOnHover = false;
    config.showNavigationArrows = true;
    config.showNavigationIndicators = false;
  }

  ngOnInit(): void {
    this.City = this.route.snapshot.paramMap.get('City');
    this.Community = this.route.snapshot.paramMap.get('Community');
    this.Address = this.route.snapshot.paramMap.get('Address');


    this.ListingKeyNumeric = this.Address.split('-').pop();

    if(this.ListingKeyNumeric != null) {
      this.getPropertyById();
      this.getSimiliarProperty();
      this.getPropertyRoomsById();
    }      
  }

  getPropertyById() {
    this.propertyService.getPropertyById(this.City, this.ListingKeyNumeric).subscribe(
      data => {
        this.propertyArr = data[0];

        for(var i = 1; i <= this.propertyArr['PhotosCount']; i++) {
          this.resourceArr.push({image: this.resourceURL + 'large/' + this.propertyArr['ListingKeyNumeric'] + "_" + i + ".jpeg"});
        }

        if(this.propertyArr['UnparsedAddress'] != "") {
          this.titleService.setTitle(this.propertyArr['UnparsedAddress'].substring(0, 60));
          this.metaService.addTags([
            {property: 'og:title', content: this.propertyArr['UnparsedAddress'].substring(0, 60)},
            {property: 'twitter:title', content: this.propertyArr['UnparsedAddress'].substring(0, 60)},
            {property: 'twitter:card', content: 'website'},
            {name: 'keywords', content: this.propertyArr['UnparsedAddress']}
          ]);
        }
        if(this.propertyArr['PhotosCount'] != 0) {
          for(var i = 1; i <= this.propertyArr['PhotosCount']; i++) {
            this.metaService.addTags([
              {property: 'og:image', content: this.resourceURL + 'large/' + this.propertyArr['ListingKeyNumeric'] + '_' + i + '.jpeg'},
              {property: 'twitter:image', content: this.resourceURL + 'large/' + this.propertyArr['ListingKeyNumeric'] + '_' + i + '.jpeg'}
            ]);
          }
          
        }
        if(this.propertyArr['PublicRemarks'] != "") {
          this.metaService.addTags([
            {name: 'description', content: this.propertyArr['PublicRemarks'].substring(0, 155)},
            {property: 'og:description', content: this.propertyArr['PublicRemarks'].substring(0, 200)},
            {property: 'twitter:description', content: this.propertyArr['PublicRemarks'].substring(0, 200)}
          ]);
        }
    
        let link: HTMLLinkElement = this.dom.createElement('link');
        link.setAttribute('rel', 'canonical');
        this.dom.head.appendChild(link);
        link.setAttribute('href', this.serverURL + this.City + "/" + this.Community + "/" + this.Address);
    
        this.metaService.addTags([
          {property: 'og:url', content: this.serverURL + this.City + "/" + this.Community + "/" + this.Address}
        ]);
      },
      err => {
        this.errMsg = JSON.parse(err.error).message;
      }
    );
  }

  getPropertyRoomsById() {
    this.propertyService.getPropertyRoomsById(this.ListingKeyNumeric).subscribe(
      data => {
        this.propertyRoomLevelsArr = data.levels;
        this.propertyRoomsArr = data.rooms;
      },
      err => {
        this.errMsg = JSON.parse(err.error).message;
      }
    )
  }

  addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? (parseInt(x[1]) == 0 ? '' : '.' + x[1]) : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }

  getDate(strDate: string) {
    if(strDate == undefined) return "";
    var arr = strDate.split("T");
    return arr[0];
  }

  showLightbox(index) {
    this.currentIndex = index;
    this.showFlag = true;
  }
  closeEventHandler() {
    this.showFlag = false;
    this.currentIndex = -1;
  }

  getSimiliarProperty() {
    this.propertyService.getSimiliarProperty(this.City, this.Community, this.ListingKeyNumeric).subscribe(
      data => {
        this.similiarPropertyArr = data;
      },
      err => {
        this.errMsg = JSON.parse(err.error).message;
      }
    );
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

  showPlace() {
    let data: DialogData = {
      lat: this.propertyArr['Latitude'],
      lng: this.propertyArr['Longitude']
    }

    this.dialog.open<DlgMapComponent,DialogData>(DlgMapComponent, { width: '800px', height: '600px', data })
      .afterClosed().toPromise();
  }

  showGallery() {
    this.dialog.open<DlgShowGalleryConfirmComponent>(DlgShowGalleryConfirmComponent)
      .afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        if(result) this.showLightbox(1);
      });
  }

}

import { Component, OnInit } from '@angular/core';
import { BasicLookupService } from '../../../../_services/basiclookup.service';
import { SERVER_URL } from '../../../../_services/endPoint';

interface ParkingFeature {
  value: string;
  viewValue: string;
}

interface ArchitecturalStyle {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-filter-side-bar',
  templateUrl: './filter-side-bar.component.html',
  styleUrls: ['./filter-side-bar.component.css']
})
export class FilterSideBarComponent implements OnInit {

  errMsg: string;

  priceMin: string;
  priceMax: string;

  yearbuildMin: string;
  yearbuildMax: string;

  selectedParkingFeature: string;
  ParkingFeatureList: ParkingFeature[];

  selectedArchitecturalStyle: string;
  ArchitecturalStyleList: ArchitecturalStyle[];

  constructor(private basicLookupService: BasicLookupService) { }

  ngOnInit(): void {
    this.getParkingFeatureList();
    this.getArchitecturalStyle();
  }

  getParkingFeatureList() {
    this.basicLookupService.getParkingFeatureList().subscribe(
      data => {
        this.ParkingFeatureList = data;
      },
      err => {
        this.errMsg = JSON.parse(err.error).message;
      }
    );
  }

  getArchitecturalStyle() {
    this.basicLookupService.getArchitecturalStyle().subscribe(
      data => {
        this.ArchitecturalStyleList = data;
      },
      err => {
        this.errMsg = JSON.parse(err.error).message;
      }
    );
  }

  onChangeParkingFeature(newValue) {

  }

  onChangeArchitecturalStyle(newValue) {
    
  }

  applyFilter() {
    
  }

}

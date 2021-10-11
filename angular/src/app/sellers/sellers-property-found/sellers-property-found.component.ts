import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { BasicLookupService } from '../../_services/basiclookup.service';

interface Community {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-sellers-property-found',
  templateUrl: './sellers-property-found.component.html',
  styleUrls: ['./sellers-property-found.component.css']
})
export class SellersPropertyFoundComponent implements OnInit {

  errMsg: string;
  
  communityList: Community[];

  @ViewChild('mapContainer', {static: false}) gmap: ElementRef;
  map: google.maps.Map;

  lat: number = 0;
  lng: number = 0;
  address: string;
  city: string;

  coordinates = new google.maps.LatLng(this.lat, this.lng);

  mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: 8,
  };

  mapInitializer() {
    this.coordinates = new google.maps.LatLng(this.lat, this.lng);

    this.mapOptions = {
      center: this.coordinates,
      zoom: 8,
    };

    this.marker = new google.maps.Marker({
      position: this.coordinates
    });

    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);

    this.marker.setMap(this.map);
  }

  marker = new google.maps.Marker({
    position: this.coordinates
  });


  constructor(private route: ActivatedRoute, private basicLookupService: BasicLookupService) { }

  ngOnInit(): void {
    this.lat = Number(this.route.snapshot.queryParamMap.get('lat'));
    this.lng = Number(this.route.snapshot.queryParamMap.get('lng'));
    this.address = this.route.snapshot.queryParamMap.get('address');
    this.city = this.route.snapshot.queryParamMap.get('city');

    console.log(this.lat, this.lng);

    this.getSubdivisionNameListByCity();
  }

  ngAfterViewInit() {
    this.mapInitializer();
  }

  getSubdivisionNameListByCity() {
    this.basicLookupService.getSubdivisionNameListByCity(this.city).subscribe(
      data => {
        this.communityList = data;
      },
      err => {
        this.errMsg = JSON.parse(err.error).message;
      }
    );
  }

  

}

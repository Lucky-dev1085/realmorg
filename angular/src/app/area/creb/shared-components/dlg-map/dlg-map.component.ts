import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-dlg-map',
  templateUrl: './dlg-map.component.html',
  styleUrls: ['./dlg-map.component.css']
})
export class DlgMapComponent implements OnInit {

  @ViewChild('mapContainer', {static: false}) gmap: ElementRef;
  map: google.maps.Map;

  lat: number = 0;
  lng: number = 0;
  address: string;

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
  
  constructor(private ref: MatDialogRef<DlgMapComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
    this.lat = this.data.lat;
    this.lng = this.data.lng;

    this.mapInitializer();
  }

  ngAfterViewInit() {
    this.mapInitializer();
  }

}

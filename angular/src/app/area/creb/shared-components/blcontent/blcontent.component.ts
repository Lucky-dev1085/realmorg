import { Component, OnInit, Input, SimpleChanges, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

import { RESOURCE_URL, SERVER_URL } from '../../../../_services/endPoint';

@Component({
  selector: 'app-blcontent',
  templateUrl: './blcontent.component.html',
  styleUrls: ['./blcontent.component.css']
})
export class BlcontentComponent implements OnInit {

  @Input() city: string = "";
  @Input() direction: string = "";
  @Input() community: string = "";
  @Input() beforeContentString: string = "";
  @Input() metaContentString: string = "";
  @Input() socialMediaString: string = '';

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

  beforeContent = [];
  metaContent = {
    title: '',
    url: '',
    keyword: '',
    description: ''
  };
  socialMedia = {
    description: ''
  }

  resourceURL = RESOURCE_URL;
  serverURL = SERVER_URL;

  constructor(private titleService: Title, private metaService: Meta, @Inject(DOCUMENT) private dom) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    var district = "";
    this.DirectionList.forEach(element => {
      if(element.viewValue == this.direction) district = element.url;
    });

    var subdivisionName = this.community.replace(/ |\//g, '-');

    var url = '';
    if(district == "") {
      if (subdivisionName == "") url = this.serverURL + this.city;
      else if (subdivisionName != "") url = this.serverURL + this.city + "/" + subdivisionName;
    } else if (subdivisionName == "")
      url = this.serverURL + this.city + "/"+ district;
    else
      url = this.serverURL + this.city + "/"+ district + "/" + subdivisionName;

    console.log("url = ", url);

    this.beforeContent = JSON.parse(this.beforeContentString);
    this.metaContent = JSON.parse(this.metaContentString);
    this.socialMedia = JSON.parse(this.socialMediaString);

    if(this.metaContent.title != "") {
      this.titleService.setTitle(this.metaContent.title.substring(0, 60));
      this.metaService.addTags([
        {property: 'og:title', content: this.metaContent.title.substring(0, 60)},
        {property: 'twitter:title', content: this.metaContent.title.substring(0, 60)},
        {property: 'twitter:card', content: 'website'},
      ]);
    }
    if(this.metaContent.url != "") {
      this.metaService.addTags([
        {property: 'og:image', content: this.resourceURL + 'PageContent/' + this.metaContent.url},
        {property: 'twitter:image', content: this.resourceURL + 'PageContent/' + this.metaContent.url}
      ]);
    }
    if(this.metaContent.description != "") {
      this.metaService.addTags([
        {name: 'description', content: this.metaContent.description.substring(0, 155)}
      ]);
    }
    if(this.metaContent.keyword != "") this.metaService.addTags([{name: 'keywords', content: this.metaContent.keyword}]);

    if(this.socialMedia.description != '') {
      this.metaService.addTags([
        {property: 'og:description', content: this.socialMedia.description.substring(0, 200)},
        {property: 'twitter:description', content: this.socialMedia.description.substring(0, 200)}
      ]);
    }

    let link: HTMLLinkElement = this.dom.createElement('link');
    link.setAttribute('rel', 'canonical');
    this.dom.head.appendChild(link);
    link.setAttribute('href', url);

    this.metaService.addTags([
      {property: 'og:url', content: url}
    ]);
    
  }

}

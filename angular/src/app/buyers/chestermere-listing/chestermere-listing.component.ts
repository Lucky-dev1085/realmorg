import { Component, Inject, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { RESOURCE_URL } from '../../_services/endPoint';

import { PropertyService } from '../../_services/property.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-chestermere-listing',
  templateUrl: './chestermere-listing.component.html',
  styleUrls: ['./chestermere-listing.component.css']
})
export class ChestermereListingComponent implements OnInit {

  errMsg: string;

  filterCondition: any = {};

  public RESOURCE_URL:string = RESOURCE_URL;

  metaContent = {
    title: '',
    url: '',
    keyword: '',
    description: ''
  };
  socialMedia = {
    description: ''
  }

  constructor(private propertyService: PropertyService, private titleService: Title, private metaService: Meta, @Inject(DOCUMENT) private dom) { 
    
  }

  ngOnInit(): void {
    this.getPageContent();
  }

  getPropertyList(filterCondition: Object) {
    this.filterCondition = filterCondition;
  }

  getPageContent() {
    this.propertyService.getPageContentByCity("Chestermere").subscribe(
      data => {
        this.metaContent = data[0].meta_content;
        this.socialMedia = data[0].social_media;

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
            {property: 'og:image', content: this.RESOURCE_URL + 'PageContent/' + this.metaContent.url},
            {property: 'twitter:image', content: this.RESOURCE_URL + 'PageContent/' + this.metaContent.url}
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
            {name: 'og:description', content: this.socialMedia.description.substring(0, 200)},
            {name: 'twitter:description', content: this.socialMedia.description.substring(0, 200)}
          ]);
        }

        let link: HTMLLinkElement = this.dom.createElement('link');
        link.setAttribute('rel', 'canonical');
        this.dom.head.appendChild(link);
        link.setAttribute('href', this.dom.URL);

        this.metaService.addTags([
          {property: 'og:url', content: this.dom.URL}
        ]);
      },
      err => {
        this.errMsg = JSON.parse(err.error).message;
      }
    )
  }

}

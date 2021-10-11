import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ENDPOINT_URL } from './endPoint';

const API_URL = ENDPOINT_URL + 'api/property/';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  constructor(private http: HttpClient) { }

  getOurListing(): Observable<any> {
    return this.http.get(API_URL + 'recentList', { responseType: 'json' });
  }

  getPropertySearchResult(city: string, subdivisionName: string, propertyType: string, limit: number, offset: number): Observable<any> {
    return this.http.post(API_URL + 'propertySearchResult', 
    {
      "city": city,
      "subdivisionName": subdivisionName,
      "propertyType": propertyType,
      "limit": limit,
      "offset": offset
    }, {responseType: 'json'});
  }

  getPropertyById(City: string, ListingKeyNumeric: string): Observable<any> {
    return this.http.post(API_URL + 'PropertyById', 
    {
      "City": City,
      "ListingKeyNumeric": ListingKeyNumeric
    }, {responseType: 'json'});
  }

  getPropertyRoomsById(ListingKeyNumeric: string): Observable<any> {
    return this.http.post(API_URL + 'PropertyRoomsById', 
    {
      "ListingKeyNumeric": ListingKeyNumeric
    }, {responseType: 'json'});
  }

  getSimiliarProperty(City: string, Community: string, ListingKeyNumeric: string): Observable<any> {
    return this.http.post(API_URL + 'SimiliarProperty', 
    {
      "City": City,
      "Community": Community,
      "ListingKeyNumeric": ListingKeyNumeric
    }, {responseType: 'json'});
  }

  getPropertyCalgarySearchResult(filterCondition: object, limit: number, offset: number): Observable<any> {
    var city = filterCondition['city'];
    var district = filterCondition['district'];
    var subdivisionName = filterCondition['subdivisionName'];

    return this.http.post(API_URL + 'PropertyCalgarySearchResult', 
    {
      "city": city,
      "district": district,
      "subdivisionName": subdivisionName,
      "limit": limit,
      "offset": offset
    }, {responseType: 'json'});
  }

  getPageContent(filterCondition: object): Observable<any> {
    var city = filterCondition['city'];
    var district = filterCondition['district'];
    var subdivisionName = filterCondition['subdivisionName'];

    return this.http.post(API_URL + 'PageContent', 
    {
      "city": city,
      "district": district,
      "community": subdivisionName,
    }, {responseType: 'json'});
  }

  getPageContentByCity(city: string): Observable<any> {
    return this.http.post(API_URL + 'PageContent', 
    {
      "city": city,
      "district": '',
      'community': ''
    }, {responseType: 'json'});
  }

  savePageContent(city: string, district: string, subdivisionName: string, heading: string, subheading: string, content: string, style: string, type: string, order_num: number): Observable<any> {
    return this.http.post(API_URL + 'savePageContent', 
    {
      "city": city,
      "district": district,
      "subdivisionName": subdivisionName,
      "heading": heading,
      "subheading": subheading,
      "content": content,
      "style": style,
      "type": type,
      "order_num": order_num
    }, {responseType: 'json'});
  }

  clearPageContent(city: string, district: string, subdivisionName: string, style: string, order_num: number): Observable<any> {
    return this.http.post(API_URL + 'clearPageContent', 
    {
      "city": city,
      "district": district,
      "subdivisionName": subdivisionName,
      "style": style,
      "order_num": order_num
    }, {responseType: 'json'});
  }

  saveMetaContent(city: string, district: string, subdivisionName: string, title: string, url: string, keyword: string, description: string, socialdescription: string, style: string, type: string, order_num: number): Observable<any> {
    return this.http.post(API_URL + 'saveMetaContent', 
    {
      "city": city,
      "district": district,
      "subdivisionName": subdivisionName,
      "title": title,
      "url": url,
      "keyword": keyword,
      "description": description,
      "socialdescription": socialdescription,
      "style": style,
      "type": type,
      "order_num": order_num
    }, {responseType: 'json'});
  }
}

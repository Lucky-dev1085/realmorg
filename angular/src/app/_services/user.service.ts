import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ENDPOINT_URL } from './endPoint';

const API_URL = ENDPOINT_URL + 'api/user/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getTeamList(limit: number, offset: number): Observable<any> {
    return this.http.post(API_URL + 'getTeamList', 
    {
      limit: limit,
      offset: offset
    }, {responseType: 'json'});
  }

  getTeamListAll(): Observable<any> {
    return this.http.post(API_URL + 'getTeamListAll', 
    {}, {responseType: 'json'});
  }

  changeType(selId: string, type: string): Observable<any> {
    return this.http.post(API_URL + 'changeType', 
    {
      selId: selId,
      type: type
    }, {responseType: 'json'});
  }

  changeComment(selId: string, comment: string): Observable<any> {
    return this.http.post(API_URL + 'changeComment', 
    {
      selId: selId,
      comment: comment
    }, {responseType: 'json'});
  }

  saveMember(selId: string, str_first_name: string, str_last_name: string, str_type: string, str_email: string, str_cell_phone: string, str_office_phone: string, str_avatar: string, str_address: string, str_content: string): Observable<any> {
    if(selId == '') {
      return this.http.post(API_URL + 'createNewMember', 
      {
        selId: selId,
        first_name: str_first_name,
        last_name: str_last_name,
        type: str_type,
        email: str_email,
        cell_phone: str_cell_phone,
        office_phone: str_office_phone,
        avatar: str_avatar,
        address: str_address,
        content: str_content
      }, {responseType: 'json'});
    } else {
      return this.http.post(API_URL + 'saveMember', 
      {
        selId: selId,
        first_name: str_first_name,
        last_name: str_last_name,
        type: str_type,
        email: str_email,
        cell_phone: str_cell_phone,
        office_phone: str_office_phone,
        avatar: str_avatar,
        address: str_address,
        content: str_content
      }, {responseType: 'json'});
    }
  }

  deleteMember(selId: string): Observable<any> {
    return this.http.post(API_URL + 'deleteMember', 
    {
      selId: selId
    }, {responseType: 'json'});
  }

  changePwd(selId: string): Observable<any> {
    return this.http.post(API_URL + 'changePwd', 
    {
      selId: selId
    }, {responseType: 'json'});
  }

}

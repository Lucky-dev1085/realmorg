import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ENDPOINT_URL } from './endPoint';

const API_URL = ENDPOINT_URL + 'api/leads/';

@Injectable({
  providedIn: 'root'
})
export class LeadsService {

  constructor(private http: HttpClient) { }

  getLeadTypeList(): Observable<any> {
    return this.http.post(API_URL + 'getLeadTypeList', 
    {
    }, {responseType: 'json'});
  }

  getLeadStatusList(): Observable<any> {
    return this.http.post(API_URL + 'getLeadStatusList', 
    {
    }, {responseType: 'json'});
  }

  getLeadSubTypeList(type_id: string): Observable<any> {
    return this.http.post(API_URL + 'getLeadSubTypeList', 
    {
      type_id: type_id
    }, {responseType: 'json'});
  }

  saveLeads(type: string, address: string, first_name: string, last_name: string, email: string, phone: string, msg: string, lead_type: string, lead_subtype: string): Observable<any> {
    return this.http.post(API_URL + 'saveLeads', 
    {
      "type": type,
      "address": address,
      "first_name": first_name,
      "last_name": last_name,
      "email": email,
      "phone": phone,
      "msg": msg,
      lead_type: lead_type,
      lead_subtype: lead_subtype
    }, {responseType: 'json'});
  }

  getLeadsList(limit: number, offset: number, teamId: string, role: string, status: string, selYear: string, selMonth: string): Observable<any> {
    return this.http.post(API_URL + 'getLeadsList', 
    {
      limit: limit,
      offset: offset,
      teamId: teamId,
      role: role,
      status: status,
      selYear: selYear,
      selMonth: selMonth
    }, {responseType: 'json'});
  }

  getLeadById(selId: string): Observable<any> {
    return this.http.post(API_URL + 'getLeadById', 
    {
      selId: selId
    }, {responseType: 'json'});
  }

  changeByTeam(selId: string, byTeam: string): Observable<any> {
    return this.http.post(API_URL + 'changeByTeam', 
    {
      selId: selId,
      byTeam: byTeam
    }, {responseType: 'json'});
  }

  changeStatus(selId: string, status: string, byTeam: string): Observable<any> {
    return this.http.post(API_URL + 'changeStatus', 
    {
      selId: selId,
      status: status,
      byTeam: byTeam
    }, {responseType: 'json'});
  }

  ChangeType(selId: string, type: string, byTeam: string): Observable<any> {
    return this.http.post(API_URL + 'ChangeType', 
    {
      selId: selId,
      type: type,
      byTeam: byTeam
    }, {responseType: 'json'});
  }

  ChangeSubType(selId: string, subtype: string, byTeam: string): Observable<any> {
    return this.http.post(API_URL + 'ChangeSubType', 
    {
      selId: selId,
      subtype: subtype,
      byTeam: byTeam
    }, {responseType: 'json'});
  }

  saveCommnet(selId: string, comment: string, byTeam: string, team_member: string): Observable<any> {
    return this.http.post(API_URL + 'saveCommnet', 
    {
      selId: selId,
      comment: comment,
      byTeam: byTeam,
      team_member: team_member
    }, {responseType: 'json'});
  }

  changeToMember(selId: string): Observable<any> {
    return this.http.post(API_URL + 'changeToMember', 
    {
      selId: selId
    }, {responseType: 'json'});
  }

  ChangeContactAgain(selId: string, contact_again: string, byTeam: string): Observable<any> {
    return this.http.post(API_URL + 'ChangeContactAgain', 
    {
      selId: selId,
      contact_again: contact_again,
      byTeam: byTeam
    }, {responseType: 'json'});
  }

  permPhone(selId: string, perm: string, byTeam: string): Observable<any> {
    return this.http.post(API_URL + 'permPhone', 
    {
      selId: selId,
      perm: perm,
      byTeam: byTeam
    }, {responseType: 'json'});
  }

  permEmail(selId: string, perm: string, byTeam: string): Observable<any> {
    return this.http.post(API_URL + 'permEmail', 
    {
      selId: selId,
      perm: perm,
      byTeam: byTeam
    }, {responseType: 'json'});
  }

  permText(selId: string, perm: string, byTeam: string): Observable<any> {
    return this.http.post(API_URL + 'permText', 
    {
      selId: selId,
      perm: perm,
      byTeam: byTeam
    }, {responseType: 'json'});
  }

  editLead(leadInfo: string): Observable<any> {
    return this.http.post(API_URL + 'editLead', 
    {
      leadInfo: leadInfo
    }, {responseType: 'json'});
  }

  createNewLead(leadInfo: string): Observable<any> {
    return this.http.post(API_URL + 'createNewLead', 
    {
      leadInfo: leadInfo
    }, {responseType: 'json'});
  }

  deleteLead(selId: string): Observable<any> {
    return this.http.post(API_URL + 'deleteLead', 
    {
      selId: selId
    }, {responseType: 'json'});
  }
}

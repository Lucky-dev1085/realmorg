import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENDPOINT_URL } from './endPoint';

const AUTH_API = ENDPOINT_URL + 'api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email, password): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      email: email,
      password: password
    }, httpOptions);
  }

  register(email, password, username, role): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username: username,
      email: email,
      password: password,
      role: role
    }, httpOptions);
  }

  login_member(email, password): Observable<any> {
    return this.http.post(AUTH_API + 'signin_member', {
      email: email,
      password: password
    }, httpOptions);
  }

  register_member(email, password, first_name, last_name, role): Observable<any> {
    return this.http.post(AUTH_API + 'signup_member', {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
      role: role
    }, httpOptions);
  }
}

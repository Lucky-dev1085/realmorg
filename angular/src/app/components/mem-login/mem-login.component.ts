import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../_services/auth.service';
import { $mem_animations } from './mem-login-animations';
import { $mem_providers } from './mem-login-providers';
import { $mem_pages } from './mem-login-pages';
import { from } from 'rxjs';
import { TokenStorageService } from '../../_services/token-storage.service';

import { SERVER_URL } from '../../_services/endPoint';
import { Router } from '@angular/router';

type memLoginAction = 'register'|'signIn'|'forgotPassword'|'changePassword'|'changeEmail'|'delete'|'signOut';

@Component({
  selector: 'app-mem-login',
  templateUrl: './mem-login.component.html',
  styleUrls: ['./mem-login.component.css']
})
export class MemLoginComponent implements OnInit {

  serverURL = SERVER_URL;

  readonly providers = $mem_providers;
  public pages = $mem_pages;
  
  public page: memLoginAction;
  public code: string;

  readonly form: FormGroup;
  public first_name: FormControl;
  public last_name: FormControl;
  public email: FormControl;
  public password: FormControl;
  public newEmail: FormControl;
  public newPassword: FormControl;

  public hidePassword = true;
  public error = null;
  public progress = false;
  isLoggedIn_member: boolean;
  
  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router) { 
    // Form controls
    this.first_name = new FormControl(null, Validators.required);
    this.last_name = new FormControl(null, Validators.required);
    this.email = new FormControl(null, [Validators.required, Validators.email]);
    this.password = new FormControl(null, Validators.required);
    this.newEmail = new FormControl(null, [Validators.required, Validators.email]);
    this.newPassword = new FormControl(null, Validators.required);

    // Empty form group
    this.form = new FormGroup({});

    // Populates the form according to the page
    this.switchPage(this.page = 'signIn');
  }

  ngOnInit(): void {
  }

  get currentPage() { return this.pages[this.page || 'signIn']; }

  private switchPage(page: memLoginAction) {

    // Removes all the controls from the form group
    Object.keys(this.form.controls).forEach( control => {
      this.form.removeControl(control);
    });
    
    // Add the relevant controls to the form according to selected page
    switch(this.page = page) {

      case 'register':
      this.form.addControl('first_name', this.first_name);
      this.form.addControl('last_name', this.last_name);
      this.form.addControl('email', this.email);
      this.form.addControl('password', this.password);
      break;

      default:
      case 'signIn':
      this.form.addControl('email', this.email);
      this.form.addControl('password', this.password);      
      break;

      case 'forgotPassword':
      this.form.addControl('email', this.email);
      break;

      case 'changePassword':
      this.form.addControl('password', this.password);
      this.form.addControl('newPassword', this.newPassword);
      break;

      case 'changeEmail':
      this.form.addControl('password', this.password);
      this.form.addControl('newEmail', this.newEmail);
      break;

      case 'delete':
      this.form.addControl('password', this.password);      
      break;
    }
  }

  private showError(error: string) {

    this.error = error;
    this.progress = false;
    setTimeout(() => this.error = null, 5000);
  }

  public activate(action: memLoginAction) {

    this.progress = true;
    
    switch(action) {

      default:
      case 'signIn':
      this.signIn( this.email.value, this.password.value );
      break;

      case 'register':
      this.registerNew( this.email.value, this.password.value, this.first_name.value, this.last_name.value );
      break;

      case 'forgotPassword':
      this.forgotPassword( this.email.value );
      break;

      case 'changePassword':
      this.updatePassword( this.password.value, this.newPassword.value );
      break;

      case 'changeEmail':
      this.updateEmail( this.password.value, this.newEmail.value );
      break;

      case 'delete':
      this.deleteAccount( this.password.value );
      break;
    }
  }

  private registerNew(email: string, password: string, first_name: string, last_name: string) {

    this.authService.register_member(email, password, first_name, last_name, "Team").subscribe(
      data => {
        if(data.status == "success") {
          this.tokenStorage.saveToken_member(data.data.accessToken);
          this.tokenStorage.saveUser_member(data.data);
          this.isLoggedIn_member = true;

          if(data.data.role == "ROLE_Admin" || data.data.role == "ROLE_Team") {
            this.router.navigate(['/memdash']);
          }

        } else {
          this.showError(data.msg);
        }
      },
      err => {
        this.showError(err.message);
      }
    );
  }

  private signIn(email: string, password: string) {
    this.authService.login_member(email, password).subscribe(
      data => {
        if(data.status == "success") {
          this.tokenStorage.saveToken_member(data.data.accessToken);
          this.tokenStorage.saveUser_member(data.data);
          this.isLoggedIn_member = true;

          if(data.data.role == "ROLE_Admin" || data.data.role == "ROLE_Team") {
            this.router.navigate(['/memdash']);
          }
        } else {
          this.showError(data.msg);
        }
      },
      err => {
        this.showError(err.message)
      }
    );
  }

  private signInWith(provider: string) { 
    // Signing-in with a provider    
    // this.auth.signInWith( provider )
    //    // Creates the new user profile if needed, keeps the existing one otherwise
    //   .then( user => this.profile.register(user)
    //     // Closes the dialog returning the user
    //     .then( () => this.ref.close(user) )
    //   )
    //   // Dispays the error code, eventually
    //   .catch( error => this.showError(error.code) );
  }

  private forgotPassword(email: string) {

    // this.auth.sendPasswordResetEmail(email)
    //   // Closes the dialog returning null
    //   .then( () => this.ref.close(null) )
    //   // Dispays the error code, eventually
    //   .catch( error => this.showError(error.code) );
  }
  
  private updateEmail(password: string, newEmail: string) {
    // Refreshes the authentication
    // this.auth.refresh(password)
    //   // Updates the email returning the new user object
    //   .then( user => user.updateEmail(newEmail).then( () => this.ref.close(user) ) )
    //   // Dispays the error code, eventually
    //   .catch( error => this.showError(error.code) );
  }

  private updatePassword(password: string, newPassword: string) {
    // Refreshes the authentication
    // this.auth.refresh(password)
    //   // Updates the password returning the new user object
    //   .then( user => user.updatePassword(newPassword).then( () => this.ref.close(user) ) )
    //   // Dispays the error code, eventually
    //   .catch( error => this.showError(error.code) );
  }

  private deleteAccount(password: string) {
    // Refreshes the authentication
    // this.auth.refresh(password)
    //    // Deletes the user profile first
    //   .then( user => this.profile.delete()
    //     // Deletes the user object next
    //     .then( () => user.delete() )
    //   )
    //   // Closes the dialog returning null
    //   .then( () => this.ref.close(null) )
    //   // Dispays the error code, eventually
    //   .catch( error => this.showError(error.code) );
  }
}

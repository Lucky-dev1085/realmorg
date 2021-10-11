import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoginComponent, loginAction } from '../components/login/login.component';
import { SERVER_URL } from './endPoint';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  serverURL = SERVER_URL;
  isLoggedIn: string = "false";
  userInfo: any;
  isLoggedIn_member: string = "false";
  userInfo_member: any;

  constructor(private dialog: MatDialog, private tokenStorageService: TokenStorageService, private router: Router) {
    this.isLoggedIn = this.tokenStorageService.isLoggedIn;
    tokenStorageService.LoggedInChange.subscribe((value) => { 
      this.isLoggedIn = value; 
    });

    this.userInfo = this.tokenStorageService.getUser();
    tokenStorageService.UserInfoChange.subscribe((value) => {
      this.userInfo = value;
    })

    this.isLoggedIn_member = this.tokenStorageService.isLoggedIn_member;
    tokenStorageService.LoggedInChange_member.subscribe((value) => { 
      this.isLoggedIn_member = value; 
    });

    this.userInfo_member = this.tokenStorageService.getUser_member();
    tokenStorageService.UserInfoChange_member.subscribe((value) => {
      this.userInfo_member = value;
    })
  }

  /** Prompts the user for authentication */
  public prompt(data: loginAction = 'signIn') {

    return this.dialog.open<LoginComponent,loginAction>(LoginComponent, { data })
      .afterClosed().toPromise();
  }

  /** Performs the user authentication prompting the user when neeed or resolving to the current authenticated user otherwise */
  public authenticate(action: loginAction = 'signIn') {

    return this.prompt(action);
  }

  // Implements single route user authentication guarding
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(route.routeConfig.path == "memdash") {
      if(this.isLoggedIn_member == 'true' && (this.userInfo_member.role == 'ROLE_Admin' || this.userInfo_member.role == 'ROLE_Team')) {
        return true;
      } else if (this.isLoggedIn_member == "false") {
        this.router.navigate(['/memlogin']);
        return true;
      }
      this.router.navigate(['/']);
      return false;
    } 
    
    return true;
  }
}
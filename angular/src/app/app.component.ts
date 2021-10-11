import { Component, HostListener } from '@angular/core';
import { Router,NavigationEnd, RoutesRecognized  } from '@angular/router';
import { SERVER_URL } from './_services/endPoint';
import { TokenStorageService } from './_services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  schema = {
    '@context': 'http://schema.org',
    '@type': 'WebSite',
    name: 'Real Estate',
    url: 'http://realmorg.com',
    image: 'http://realmorg.com/assets/mortgage_logo.png'
  };

  serverURL = SERVER_URL;

  isLoggedIn: string = "false";
  userInfo = null;
  userInfoString = JSON.stringify(this.userInfo);

  isLoggedIn_member: string = "false";
  userInfo_member = null;
  userInfoString_member = JSON.stringify(this.userInfo_member);

  showMemberBoard = false;
  showUserBoard = true;
  username: string;

  title = 'Real Estate';

  constructor(private tokenStorageService: TokenStorageService, private router: Router) {

    this.isLoggedIn = this.tokenStorageService.isLoggedIn;
    tokenStorageService.LoggedInChange.subscribe((value) => { 
      this.isLoggedIn = value; 
    });

    this.userInfo = this.tokenStorageService.getUser();
    this.userInfoString = JSON.stringify(this.userInfo);
    tokenStorageService.UserInfoChange.subscribe((value) => {
      this.userInfo = value;
      this.userInfoString = JSON.stringify(this.userInfo);
    })

    this.isLoggedIn_member = this.tokenStorageService.isLoggedIn_member;
    tokenStorageService.LoggedInChange_member.subscribe((value) => { 
      this.isLoggedIn_member = value; 
    });

    this.userInfo_member = this.tokenStorageService.getUser_member();
    this.userInfoString_member = JSON.stringify(this.userInfo_member);
    tokenStorageService.UserInfoChange_member.subscribe((value) => {
      this.userInfo_member = value;
      this.userInfoString_member = JSON.stringify(this.userInfo_member);
    })

    this.router.events.subscribe(event => {
      // if (event instanceof RoutesRecognized) {
      //   console.log('navigated to:', event.url);
      //   console.log('route state', event.state);
      //   console.log('');
      // }
      if (event instanceof NavigationEnd) {
        // if u dont need the state, you could even use this event-type..
        // console.log(event);
        if(event.url == "/memdash" || event.url == '/memlogin' || event.url == '/memdash/leads' || event.url == '/memdash/team-members') {
          this.showMemberBoard = true;
          this.showUserBoard = false;
        } else {
          this.showMemberBoard = false;
          this.showUserBoard = true;
        }
      }
    });
  }

  ngOnInit(): void {
  }
}

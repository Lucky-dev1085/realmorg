import { Component, OnInit } from '@angular/core';
import { SERVER_URL } from '../../_services/endPoint';
import { TokenStorageService } from '../../_services/token-storage.service';

@Component({
  selector: 'app-memdash-home',
  templateUrl: './memdash-home.component.html',
  styleUrls: ['./memdash-home.component.css']
})
export class MemdashHomeComponent implements OnInit {

  serverURL = SERVER_URL;
  isLoggedIn_member: string = "false";
  userInfo_member: any;

  constructor(private tokenStorageService: TokenStorageService) { 
    this.isLoggedIn_member = this.tokenStorageService.isLoggedIn_member;
    tokenStorageService.LoggedInChange_member.subscribe((value) => { 
      this.isLoggedIn_member = value; 
    });

    this.userInfo_member = this.tokenStorageService.getUser_member();
    tokenStorageService.UserInfoChange_member.subscribe((value) => {
      this.userInfo_member = value;
    })
  }

  ngOnInit(): void {
  }

}

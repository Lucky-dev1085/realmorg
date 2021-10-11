import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../_services/token-storage.service';
import { RESOURCE_URL } from '../../_services/endPoint';

@Component({
  selector: 'app-md-topbar',
  templateUrl: './md-topbar.component.html',
  styleUrls: ['./md-topbar.component.css']
})
export class MdTopbarComponent implements OnInit {

  @Input() isLoggedIn_member: string = "false";
  @Input() userInfoString_member: string;

  userInfo_member: any;

  resourceURL = RESOURCE_URL;

  constructor(private tokenStorageService: TokenStorageService, private router: Router) { 
    
  }
  
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.userInfo_member = JSON.parse(this.userInfoString_member);
    console.log(this.userInfo_member);
  }

  login() {
    this.router.navigate(['/memlogin']);
  }

  logout() {
    this.tokenStorageService.signOut_member();
    this.router.navigate(['/memlogin']);
  }

}

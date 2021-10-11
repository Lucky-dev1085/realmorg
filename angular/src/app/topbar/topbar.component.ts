import { Component, Input, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { AuthGuard } from '../_services/auth-guard.service';
import { TokenStorageService } from '../_services/token-storage.service';
declare var $: any;

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  @Input() isLoggedIn: string = "false";
  @Input() userInfoString: string;

  userInfo: any;

  enteredButton = false;
  isMatMenuOpen = false;
  isMatMenu2Open = false;
  prevButtonTrigger;

  constructor(private ren: Renderer2, readonly guard: AuthGuard, private tokenStorageService: TokenStorageService) { 
    
  }
  
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.userInfo = JSON.parse(this.userInfoString);
    console.log(this.userInfo);
  }

  menuenter() {
    console.log("menu Enter");
    
    this.isMatMenuOpen = true;
    if (this.isMatMenu2Open) {
      this.isMatMenu2Open = false;
    }
  }

  menuLeave(trigger, button) {
    console.log("menu leave");

    setTimeout(() => {
      if (!this.isMatMenu2Open && !this.enteredButton) {
        this.isMatMenuOpen = false;
        trigger.closeMenu();
        // this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        // this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } else {
        this.isMatMenuOpen = false;
      }
    }, 80)
  }

  menu2enter() {
    console.log("menu 2 enter");
    this.isMatMenu2Open = true;
  }

  menu2Leave(trigger1, trigger2, button) {
    console.log("menu 2 leave");
    setTimeout(() => {
      if (this.isMatMenu2Open) {
        trigger1.closeMenu();
        this.isMatMenuOpen = false;
        this.isMatMenu2Open = false;
        this.enteredButton = false;
        // this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        // this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } else {
        this.isMatMenu2Open = false;
        trigger2.closeMenu();
      }
    }, 100)
  }

  buttonEnter(trigger) {
    setTimeout(() => {
      if(this.prevButtonTrigger && this.prevButtonTrigger != trigger){
        this.prevButtonTrigger.closeMenu();
        this.prevButtonTrigger = trigger;
        this.isMatMenuOpen = true;
        this.isMatMenu2Open = false;
        trigger.openMenu();
        // this.ren.removeClass(trigger.menu.items.first['_elementRef'].nativeElement, 'cdk-focused');
        // this.ren.removeClass(trigger.menu.items.first['_elementRef'].nativeElement, 'cdk-program-focused');
      }
      else if (!this.isMatMenuOpen) {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger
        this.isMatMenuOpen = true;
        this.isMatMenu2Open = false;
        trigger.openMenu();
        // this.ren.removeClass(trigger.menu.items.first['_elementRef'].nativeElement, 'cdk-focused');
        // this.ren.removeClass(trigger.menu.items.first['_elementRef'].nativeElement, 'cdk-program-focused');
      }
      this.enteredButton = true;
      this.prevButtonTrigger = trigger

      $("button").attr('style','outline: 0px !important');
      $(".cdk-overlay-container .cdk-overlay-backdrop-showing").attr('style','display: none !important');
    })
  }

  residentialBtnEnter() {
    setTimeout(() => {
      this.enteredButton = false;
      this.isMatMenuOpen = false;
      this.prevButtonTrigger.closeMenu();
      $("button").attr('style','outline: 0px !important');
      $(".cdk-overlay-container .cdk-overlay-backdrop-showing").attr('style','display: none !important');
    })
  }

  buttonLeave(trigger, button) {

    setTimeout(() => {
      if (this.enteredButton && !this.isMatMenuOpen) {
        trigger.closeMenu();
        // this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        // this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } if (!this.isMatMenuOpen) {
        trigger.closeMenu();
        // this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        // this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } else {
        this.enteredButton = false;
      }
      // this.enteredButton = false; 
      // this.isMatMenuOpen = false;
      // this.isMatMenu2Open = false;

      $("button").attr('style','outline: 0px !important');
      $(".cdk-overlay-container .cdk-overlay-backdrop-showing").attr('style','display: none !important');
    }, 100)
  }

  logout() {
    this.tokenStorageService.signOut();
  }

}

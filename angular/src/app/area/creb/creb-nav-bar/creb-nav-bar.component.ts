import { Component, OnInit, Renderer2 } from '@angular/core';
import { BasicLookupService } from '../../../_services/basiclookup.service';
import { SERVER_URL } from '../../../_services/endPoint';

declare var $: any;

@Component({
  selector: 'app-creb-nav-bar',
  templateUrl: './creb-nav-bar.component.html',
  styleUrls: ['./creb-nav-bar.component.css']
})
export class CrebNavBarComponent implements OnInit {

  errMsg: string = '';

  serverURL = SERVER_URL;

  enteredButton = false;
  isMatMenuOpen = false;
  isMatMenu2Open = false;
  prevButtonTrigger;

  menuContent = [];

  DirectionList = [
    {value: 'Calgary', viewValue: 'Calgary', url: 'Calgary'},
    {value: 'CAL Zone NE', viewValue: 'North East', url: 'Calgary-NE'},
    {value: 'CAL Zone NW', viewValue: 'North West', url: 'Calgary-NW'},
    {value: 'CAL Zone SE', viewValue: 'South East', url: 'Calgary-SE'},
    {value: 'CAL Zone SW', viewValue: 'South West', url: 'Calgary-SW'},
    {value: 'CAL Zone N', viewValue: 'North', url: 'Calgary-N'},
    {value: 'CAL Zone E', viewValue: 'East', url: 'Calgary-E'},
    {value: 'CAL Zone W', viewValue: 'West', url: 'Calgary-W'},
    {value: 'CAL Zone S', viewValue: 'South', url: 'Calgary-S'},
    {value: 'CAL Zone CC', viewValue: 'Center', url: 'Calgary-CC'}
  ];

  constructor(private ren: Renderer2, private basicLookupService: BasicLookupService) { }

  ngOnInit(): void {
    this.getMenuContent();
  }

  getMenuContent() {
    this.basicLookupService.getMenuContent().subscribe(
      data => {
        this.menuContent = data;
      },
      err => {
        this.errMsg = JSON.parse(err.error).message;
      }
    );
  }

  menuenter() {
    this.isMatMenuOpen = true;
    if (this.isMatMenu2Open) {
      this.isMatMenu2Open = false;
    }
  }

  menuLeave(trigger, button) {
    setTimeout(() => {
      if (!this.isMatMenu2Open && !this.enteredButton) {
        this.isMatMenuOpen = false;
        trigger.closeMenu();
      } else {
        this.isMatMenuOpen = false;
      }
    }, 80);
  }

  menu2enter() {
    this.isMatMenu2Open = true;
  }

  menu2Leave(trigger1, trigger2, button) {
    setTimeout(() => {
      if (this.isMatMenu2Open) {
        trigger1.closeMenu();
        this.isMatMenuOpen = false;
        this.isMatMenu2Open = false;
        this.enteredButton = false;
      } else {
        this.isMatMenu2Open = false;
        trigger2.closeMenu();
      }
    }, 100);
  }

  buttonEnter(trigger) {
    console.log("btn enter");
    setTimeout(() => {
      if (this.prevButtonTrigger && this.prevButtonTrigger != trigger) {
        this.prevButtonTrigger.closeMenu();
        this.prevButtonTrigger = trigger;
        this.isMatMenuOpen = true;
        this.isMatMenu2Open = false;
        trigger.openMenu();
      } else if (!this.isMatMenuOpen) {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger;
        this.isMatMenuOpen = true;
        this.isMatMenu2Open = false;
        trigger.openMenu();
      } 
        this.enteredButton = true;
        this.prevButtonTrigger = trigger;

      $("button").attr('style','outline: 0px !important');
      $(".cdk-overlay-container .cdk-overlay-backdrop-showing").attr('style','display: none !important');
    }, 100);
  }

  buttonLeave(trigger, button) {
    console.log("btn leave");
    setTimeout(() => {
      if (this.enteredButton && !this.isMatMenuOpen) {
        trigger.closeMenu();
      }
      if (!this.isMatMenuOpen) {
        trigger.closeMenu();
      } else {
        this.enteredButton = false;
      }

      $("button").attr('style','outline: 0px !important');
      $(".cdk-overlay-container .cdk-overlay-backdrop-showing").attr('style','display: none !important');

    }, 100);
  }

  getURL(city, district, newValue) {
    // var community = newValue.replaceAll(" ", "-");
    // community = community.replaceAll("/", "-");
    var community = newValue.replace(/ |\//g, '-');

    if (district == "") {
      if(city == newValue) return city;
      else return city + "/" + community;
    } else if (district == newValue) {
      return city + "/" + district;
    }
    else 
      return city + "/" + district + "/" + community;
  }

}

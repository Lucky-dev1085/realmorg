import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface AlertData {
  msg: string;
}

@Component({
  selector: 'app-dlg-alert',
  templateUrl: './dlg-alert.component.html',
  styleUrls: ['./dlg-alert.component.css']
})
export class DlgAlertComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: AlertData) { }

  ngOnInit(): void {
  }

}

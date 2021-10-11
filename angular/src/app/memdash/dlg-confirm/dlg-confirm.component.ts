import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface ConfirmDialogData {
  msg: string;
}

@Component({
  selector: 'app-dlg-confirm',
  templateUrl: './dlg-confirm.component.html',
  styleUrls: ['./dlg-confirm.component.css']
})
export class DlgConfirmComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) { }

  ngOnInit(): void {
  }

}

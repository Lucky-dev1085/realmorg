import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-alcontent',
  templateUrl: './alcontent.component.html',
  styleUrls: ['./alcontent.component.css']
})
export class AlcontentComponent implements OnInit {

  @Input() city: string = "";
  @Input() direction: string = "";
  @Input() community: string = "";
  @Input() afterContentString: string = "";

  afterContent = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.afterContent = JSON.parse(this.afterContentString);
  }

}

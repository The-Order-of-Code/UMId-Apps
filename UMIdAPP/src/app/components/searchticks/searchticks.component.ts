import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-searchticks',
  templateUrl: './searchticks.component.html',
  styleUrls: ['./searchticks.component.scss'],
})
export class SearchticksComponent implements OnInit {
  @Input() card_type: any;
  @Input() items: any;

  constructor() {
   
   }

  ngOnInit() {}

}

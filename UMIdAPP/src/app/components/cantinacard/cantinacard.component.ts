import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cantinacard',
  templateUrl: './cantinacard.component.html',
  styleUrls: ['./cantinacard.component.scss'],
})
export class CantinacardComponent implements OnInit {
  @Input() items:any; 
  @Input() card_type:any;

  constructor() { }

  ngOnInit() {}

}

import { Component, OnInit, Input , Output, EventEmitter, ViewChild } from '@angular/core';
import { IconsComponent } from '../icons/icons.component';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardsComponent implements OnInit {
  @Input() card_type: any;
  @Input() items: any;
  @Output() eventEmitter = new EventEmitter();
  width: number;
  icons: string;

  constructor() { 
    this.icons="verificar senha";
    this.width = window.innerWidth;
  }

  ngOnInit() {}


  goBack(){
    this.eventEmitter.emit('back');
  }


}

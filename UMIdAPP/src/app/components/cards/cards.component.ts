import { Component, OnInit, Input , Output, EventEmitter } from '@angular/core';

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
  constructor() { 
    this.width = window.innerWidth;
  }

  ngOnInit() {}

  goBack(){
    this.eventEmitter.emit('back');
  }


}

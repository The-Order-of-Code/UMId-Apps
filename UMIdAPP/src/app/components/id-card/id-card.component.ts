import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-id-card',
  templateUrl: './id-card.component.html',
  styleUrls: ['./id-card.component.scss'],
})
export class IdCardComponent implements OnInit {
  @Input() card_info: any;
  @Output() eventEmitter = new EventEmitter();
  photo: string;
  platform: string;
  width: number;
  constructor(
    public platf : Platform,
  ) { }

  ngOnInit() {
    this.width = window.innerWidth;
    if(this.platf.is('ios')){
      this.platform = 'ios';
    } 
    else this.platform = 'android';
    this.photo = 'data:image/jpeg;base64,' + this.card_info.portrait;
  }

  goBack(){
    this.eventEmitter.emit('back');
  }

}

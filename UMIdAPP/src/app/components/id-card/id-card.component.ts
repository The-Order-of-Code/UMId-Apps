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
    console.log(this.card_info);
    this.photo = 'data:image/jpeg;base64,' + this.card_info.user.picture;
  }

  calcAge(birthDate) {
    return Math.floor((Date.now() - new Date(birthDate).getTime()) / 3.15576e+10);
  }

  translate(type){
    switch(type){
      case 'STUDENT':
        return 'Estudante';
      case 'Employee':
        return 'Funcionário';
      default: return '';
    }
  }
  goBack(){
    this.eventEmitter.emit('back');
  }

}

import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IconsComponent } from '../icons/icons.component';
import { LibraryService } from '../../../services/library.service';
import * as SecureStorage from '../../../common/general/secureStorage.js';


@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardsComponent implements OnInit {
  @Input() card_type: any;
  @Input() items: any;
  @Output() eventEmitter = new EventEmitter();
  @Output() nextPageEventEmitter = new EventEmitter();
  @Output() requestTickets = new EventEmitter();
  

  width: number;
  icons: string;
  count_ticket;

  constructor(public navCtrl: NavController,private libraryService: LibraryService) {


  }
  ngOnInit() {
    this.width = window.innerWidth;
    
  }

  do_something($event){
    this.requestTickets.emit($event.target.value);

  }

  timeNow(d) {
    const h = (d.getHours() < 10 ? '0' : '') + d.getHours()
    const m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    return h + ':' + m;
  }

  updateDate(d) {
    const date = new Date(d);
    const today = new Date();
    if ((date.getDate() == today.getDate()) && (date.getMonth() == today.getMonth()) && (date.getFullYear() == today.getFullYear()))  {
      if (date.getHours() > today.getHours() || date.getMinutes() > today.getMinutes()) {
        return "Disponível hoje, a partir das " + this.timeNow(date) + "h";
      }
      else {
        return "Sala disponível";
      }
    }
    else {
      let tomorrow = new Date(today.toISOString());
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (date.getDate() == tomorrow.getDate() && date.getMonth() == tomorrow.getMonth() && date.getFullYear() == tomorrow.getFullYear()) {
        return "Disponível amanhã, a partir das " + this.timeNow(date) + "h";
      }
      else {
        return "Dia " + date.toLocaleDateString() + ", a partir das " + this.timeNow(date) + "h";
      }
    }
  }

  isNearReservation(date) {
    const date1 = new Date(date);
    const today = new Date();
    if (date1.getDate() == today.getDate()
      && date1.getMonth() == today.getMonth()
      && date1.getFullYear() == today.getFullYear()
      && date1.getHours() == today.getHours()
      && (date1.getMinutes() - today.getMinutes()) <= 15) {
      return true;
    }
    else return false
  }

  nextReservations(d, d2) {
    const date = new Date(d);
    const date1 = new Date(d2);
    const today = new Date();
    if (date.getDate() == today.getDate() && date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear()) {
      if (date.getHours() >= today.getHours()) {
        if (date.getHours() == today.getHours() && date.getMinutes() > today.getMinutes()) return "Hoje, das " + this.timeNow(date) + "h às " + this.timeNow(date1) + "h";
        else return "A decorrer";
      }
      else return "A decorrer";
    }
    else {
      let tomorrow = new Date(today.toISOString());
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (date.getDate() == tomorrow.getDate() && date.getMonth() == tomorrow.getMonth() && date.getFullYear() == tomorrow.getFullYear()) {
        return "Amanhã, das " + this.timeNow(date) + "h às " + this.timeNow(date1) + "h";;
      }
      else {
        return "Dia " + date.toLocaleDateString() + ", das " + this.timeNow(date) + "h às " + this.timeNow(date1) + "h";
      }
    }
  }



  nextPage(ev, item) {
    console.log("item", item);
    if (item.args) {
      this.nextPageEventEmitter.emit(JSON.stringify({ url: item.url, args: item.args }));
    }
    else this.nextPageEventEmitter.emit(JSON.stringify({ url: item.url }));
  }

  goBack() {
    this.eventEmitter.emit('back');
  }

  async cancelReservation(id){
    const ss = SecureStorage.instantiateSecureStorage();
    // Busca as credenciais do utilizador no Secure Storage
    let dataAuth = await SecureStorage.get('dataAuth', ss).then(dataUser => {
        return JSON.parse(dataUser);
    });
    this.libraryService.deleteReservation(dataAuth['username'],dataAuth['password'],id).then(result =>{
      if (result.status === 204){
         console.log('Delete with sucess!')
      }
      else{
        console.log('Delete fail :( ')
      }
    });
  }


}

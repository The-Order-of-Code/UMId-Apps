import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
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
  @Output() requestTicketsEmitter = new EventEmitter();
  @Output() addSlotsEventEmitter = new EventEmitter();
  @Output() removeSlotsEventEmitter = new EventEmitter();
  @Output() addPromoTicketsEventEmitter = new EventEmitter();
  @Output() removePromoTicketsEventEmitter = new EventEmitter();

  width: number;
  icons: string;
  count_ticket;

  countTicket1  = 0;
  countTicket2  = 0;

  value: number =0;

  normal_tickets = [];
  simple_tickets = [];
  typeTicket: any;
  
  constructor(public navCtrl: NavController,private libraryService: LibraryService, public alertController: AlertController) {
  }

  ngOnInit() {
    this.width = window.innerWidth;
    
  }

  // Caputrar quantidade de senhas 
  updateInput(event){
    this.countTicket1 = event.target.value;
  }

  updateInput2(event){
    this.countTicket2 = event.target.value;
  }

  inputKeyDownEnter(event,type_ticket){
    this.requestTicketsEmitter.emit({type:type_ticket, count:this.countTicket1});
  }

  inputKeyDownEnter2(event,type_ticket){
    this.requestTicketsEmitter.emit({type:type_ticket, count:this.countTicket2});
  }
// Caputrar quantidade de senhas  essas 4 funções

input1(event){
  this.typeTicket = event.target.value;
  console.log('here', this.typeTicket);
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
        if (date.getHours() >= today.getHours() && date.getMinutes() > today.getMinutes()) return "Hoje, das " + this.timeNow(date) + "h às " + this.timeNow(date1) + "h";
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

  addSlots(ev, item){
    item.added = true;
    this.addSlotsEventEmitter.emit('update');
  }

  removeSlots(ev, item){
    item.added = false;
    this.removeSlotsEventEmitter.emit('update');
  }

  goBack() {
    this.eventEmitter.emit('back');
  }

  async cancelReservation(id){
    this.presentAlert(
      'Cancelamento de reserva',
      'Deseja mesmo cancelar a reserva?', 
      [{
        text: 'Não',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Sim',
        handler: () => {
          this.navCtrl.navigateRoot(['/library',{userType: 'STUDENT'}]);
        }
      }]);
    const ss = SecureStorage.instantiateSecureStorage();
    // Busca as credenciais do utilizador no Secure Storage
    let dataAuth = await SecureStorage.get('dataAuth', ss).then(dataUser => {
        return JSON.parse(dataUser);
    });
    this.libraryService.deleteReservation(dataAuth['username'],dataAuth['password'],id).then(result =>{
      console.log("response",result);
      console.log('Delete with sucess!')
      SecureStorage.get('reservations', ss).then(async data => {
         let reservations = JSON.parse(data)
         reservations = reservations.filter(function(item) {
           return item.id !== JSON.parse(result.data).id
         });
         console.log("reservations: ",reservations);
         await SecureStorage.set('reservations', JSON.stringify(reservations),ss)
      });
    },
    error => {
      console.log(error);
      if(error.status == 404 && error.error == '{"detail":"Not found."}'){
        SecureStorage.get('reservations', ss).then(async data => {
          let reservations = JSON.parse(data)
          reservations = reservations.filter(function(item) {
            return item.id !== id
          });
          console.log("reservations: ",reservations);
          await SecureStorage.set('reservations', JSON.stringify(reservations),ss)
          console.log('Delete fail')
       });
      }
    });
  }

  async presentAlert(subHeader, message, buttons) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Aviso',
      subHeader: subHeader,
      message: message,
      buttons: buttons
    });

    await alert.present();
  }

  updateTicketType(event,item){
    this.typeTicket = event.target.value;
    item.type = this.typeTicket;
  }

  addPromoTicket(event,item){
    if(item.type!=undefined){
      item.added = true;
      if(item.type == 'normal') this.normal_tickets.push(item.date);
      if(item.type == 'simples') this.simple_tickets.push(item.date);
      this.addPromoTicketsEventEmitter.emit(
        {
          normal: this.normal_tickets,
          simples: this.simple_tickets
        }
      );
    }
    else {
      this.presentAlert("", "Por favor selecione o tipo de senha pretendido", ["OK"]);
    }

  }

  removePromoTicket(event,item){
    if(item.type != undefined) {
      item.added = false;
      if(item.type == 'normal') {
        const ind = this.normal_tickets.indexOf(item.date);
        if (ind > -1) {
          this.normal_tickets.splice(ind, 1);
        }
      }
      if(item.type == 'simples'){
        const ind = this.simple_tickets.indexOf(item.date);
        if (ind > -1) {
          this.simple_tickets.splice(ind, 1);
        }
      } 
      this.removePromoTicketsEventEmitter.emit(
        {
          normal: this.normal_tickets,
          simples: this.simple_tickets
        }
      );
    }
  }



}

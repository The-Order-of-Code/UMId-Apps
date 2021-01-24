import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as SecureStorage from '../../../../common/general/secureStorage.js';
import { TicketsService } from '../../../../services/tickets.service';
import * as consts from 'src/common/general/constants';

@Component({
  selector: 'app-buy-ticket-day',
  templateUrl: './buy-ticket-day.page.html',
  styleUrls: ['./buy-ticket-day.page.scss'],
})
export class BuyTicketDayPage implements OnInit {
  // nome da vista 
  view_name: string;

  // lista com items osd quais iräo na view (nesse caso o tipo de senha e sua quantidade)
  items: Object[] = [];

  card_type: string;

  show_counter: boolean;

  dataLoaded: boolean = false;

  segment: string;
  // adicionar botao voltar para trás true -> sim, false -> nao (depende da vista)
  has_back_button: boolean;
  operation_name: string;
  quantity: any;
  prod_name: string;
  picked_date: string;
  userType: string;
  ticketObj: any;

  constructor(
    private router: Router,
    private ticketsService: TicketsService) { }

  async ngOnInit() {
    this.view_name = "Senha do dia";
    this.has_back_button = true;
    this.show_counter = true;
    this.card_type = "senhas"
    this.prod_name = "senhas"
    this.quantity = 0;
    this.picked_date = ''



    const ss = SecureStorage.instantiateSecureStorage();

    let user = await SecureStorage.get('user', ss).then(user => {
      this.userType = JSON.parse(user).user.userType;
      return JSON.parse(user);
    });


    let dataAuth = await SecureStorage.get('dataAuth', ss).then(dataUser => {
      return JSON.parse(dataUser);
    });
    
    let my_resevations = await this.ticketsService.getMyTicketsPromoctions(dataAuth['username'], dataAuth['password']).then(result => {
      return JSON.parse(result.data);
    });

    let types_tickets = await this.ticketsService.getTypeTickets(dataAuth['username'], dataAuth['password']).then(result => {
      return JSON.parse(result.data);
    }); 

    console.log('Reservas', my_resevations[0])
    console.log('Tipos', types_tickets)

    let day = new Date();

    for (let i = 0; i < 10; i++) {
      let result = this.checkResarvations(day,my_resevations,types_tickets);
      if (result == 0) {
        this.items.push({date: day.toLocaleDateString(), added: false});
        this.items.push({date: day.toLocaleDateString(), added: false});
      }
      if (result == 1) {
        this.items.push({date: day.toLocaleDateString(), added: false});
      }

      day = moment(day).add(1, 'd').toDate();
    }
    this.operation_name = "adicionadas";
    this.dataLoaded = true;

  }

  async selectTicketsForDate(){
    if(this.picked_date != undefined || this.picked_date != ''){
      this.items = [];
      this.items.push({date: new Date(this.picked_date).toLocaleDateString(), added: false});
      this.items.push({date: new Date(this.picked_date).toLocaleDateString(), added: false});
      console.log(this.items)

    } else {
      const ss = SecureStorage.instantiateSecureStorage();
      let dataAuth = await SecureStorage.get('dataAuth', ss).then(dataUser => {
        return JSON.parse(dataUser);
      });
    
      let my_resevations = await this.ticketsService.getMyTicketsPromoctions(dataAuth['username'], dataAuth['password']).then(result => {
        return JSON.parse(result.data);
      });

      let types_tickets = await this.ticketsService.getTypeTickets(dataAuth['username'], dataAuth['password']).then(result => {
        return JSON.parse(result.data);
      }); 

      let day = new Date();

      for (let i = 0; i < 10; i++) {
        let result = this.checkResarvations(day,my_resevations,types_tickets);
        if (result == 0) {
          this.items.push({date: day.toLocaleDateString(), added: false});
          this.items.push({date: day.toLocaleDateString(), added: false});
        }
        if (result == 1) {
          this.items.push({date: day.toLocaleDateString(), added: false});
        }

        day = moment(day).add(1, 'd').toDate();
      }
    }
  }

  checkResarvations(day, my_resevations,types_tickets) {
    let nTicketsDay = 0; 
    my_resevations.forEach(element => {
      let dateBack = new Date(element.date)

      types_tickets.forEach(type => {
        if(type.id === element.type && ( (type.name === consts.completaP[0] || type.name === consts.completaP[1]) || (type.name === consts.simplesP[0] || type.name === consts.simplesP[1])) ){
          if (dateBack.toLocaleDateString() === day.toLocaleDateString() && nTicketsDay < 2 && element.date !== null) {
            nTicketsDay += 1
          }
        }
      });
      
    });
    return nTicketsDay;
  }

  goBack(_event) { 
    this.router.navigate(['/canteen/buy-ticket/information', { user_info: 1 }]);
  }

  sendType(event) {
    this.quantity = event;
  }

  addPromoTicket(event){
    this.quantity +=1
    console.log("add event", event)
    this.ticketObj = event;
  }

  removePromoTicket(event){
    this.quantity -=1
    console.log("remove event",event)
    this.ticketObj = event;
  }

  confirmReservation(event){
    let normalTickets, simpleTickets;
    switch(this.userType){
      case 'STUDENT':
        simpleTickets = 'Senha prato simples promocional (estudante)';
        normalTickets = 'Senha completa promocional (estudante)';
        break;
      case 'EMPLOYEE':
        simpleTickets = 'Senha prato simples promocional';
        normalTickets = 'Senha completa promocional';
        break;
      default: break;
    }
    let normal_promo_tickets = {}, simple_promo_tickets = {};
    normal_promo_tickets["ticketType"] = normalTickets;
    normal_promo_tickets["dates"] = this.ticketObj.normal.map(x => this.transformDates(x));
    simple_promo_tickets["ticketType"] = simpleTickets;
    simple_promo_tickets["dates"] = this.ticketObj.simples.map(x => this.transformDates(x));
    this.router.navigate(['/canteen/buy-ticket', {promo_tickets: JSON.stringify([simple_promo_tickets,normal_promo_tickets]), quantity: JSON.stringify(this.quantity)}]);
  }

  transformDates(date){
    const splitted_date = date.split('/');
    let newDate = new Date(parseInt(splitted_date[2]),parseInt(splitted_date[1])-1,parseInt(splitted_date[0]));
    return newDate.toISOString();
  }

}

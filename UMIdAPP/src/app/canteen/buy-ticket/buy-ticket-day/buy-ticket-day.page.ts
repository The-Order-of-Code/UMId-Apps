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

  constructor(
    private router: Router,
    private ticketsService: TicketsService) { }

  async ngOnInit() {
    this.view_name = "Senha do dia";
    this.has_back_button = true;
    this.show_counter = true;
    this.card_type = "senhas"



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

    console.log('Reservas', my_resevations[0])
    console.log('Tipos', types_tickets)

    let day = new Date();

    for (let i = 0; i < 20; i++) {
      let result = this.checkResarvations(day,my_resevations,types_tickets);
      if (result == 0) {
        this.items.push(day.toLocaleDateString());
        this.items.push(day.toLocaleDateString());
      }
      if (result == 1) {
        this.items.push(day.toLocaleDateString());
      }

      day = moment(day).add(1, 'd').toDate()


    }
    this.operation_name = "adicionadas";
    this.dataLoaded = true;

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

  sendType(_event) {
    console.log(_event)
    this.quantity = _event;
  }





}

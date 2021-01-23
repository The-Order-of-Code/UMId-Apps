import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import * as consts from 'src/common/general/constants';
import { error } from 'xstate/lib/actionTypes';
import * as SecureStorage from '../common/general/secureStorage.js'

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  constructor(private http: HTTP) { }

  setCredentials(username, password){
    this.http.setServerTrustMode('default');
    this.http.useBasicAuth(username, password); 
    this.http.setDataSerializer('json');
  }

  buyTickets(username, password, tickets) {
    this.setCredentials(username,password);
    return this.http.post(
      consts.add_tickets,
      tickets,
      {}
    );
  }

  getTypeTickets(username,password){
    this.setCredentials(username,password);
    return this.http.get(
      consts.ticket_types,
      {},
      {}
    );
  }


  getMyTicketsPromoctions(username,password){
    this.setCredentials(username,password);
    console.log('aqui')
    return this.http.get(
      consts.my_tickets,
      {},
      {}
    );
  }

  async removeTickets(ticketType){
    const ss = await SecureStorage.instantiateSecureStorage();
    SecureStorage.get('tickets',ss).then(
      async tickets_str => {
        let tickets = JSON.parse(tickets_str);
        tickets[ticketType] -=1;
        await SecureStorage.set('tickets',JSON.stringify(tickets),ss);
      },
      error => {
        console.log(error)
      }
    );
  }

  async addTickets(data){
    const ss = await SecureStorage.instantiateSecureStorage();
    SecureStorage.get('tickets',ss).then(
      async tickets_str => {
        let tickets = JSON.parse(tickets_str);
        for(const item of data.tickets){
           if(item.ticketType == "Senha completa (estudante)"
           || item.ticketType == "Senha completa"
           || item.ticketType == "Senha prato simples (estudante)"
           || item.ticketType == "Senha prato simples" ) tickets[item.ticketType] += item.amount; 
           else {
              console.log(tickets.promotional[item.ticketType])
              tickets.promotional[item.ticketType] = tickets.promotional[item.ticketType].concat(item.dates)
           }
        }
        await SecureStorage.set('tickets',JSON.stringify(tickets),ss);
      });
  }

  

}

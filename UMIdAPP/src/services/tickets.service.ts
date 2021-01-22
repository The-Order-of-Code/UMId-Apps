import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import * as consts from 'src/common/general/constants';

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

  

}

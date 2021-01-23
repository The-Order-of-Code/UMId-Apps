import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import * as SecureStorage from '../../../common/general/secureStorage.js';
import * as consts from 'src/common/general/constants';



@Component({
  selector: 'app-choice-ticket',
  templateUrl: './choice-ticket.page.html',
  styleUrls: ['./choice-ticket.page.scss'],
})
export class ChoiceTicketPage implements OnInit {
  // nome da vista 
  view_name: string;

  // lista com items osd quais iräo na view (nesse caso o tipo de senha e sua quantidade)
  items: Object[] = [];
  // Tipo de cartao 
  card_type: string;

  show_counter: boolean;

  dataLoaded: boolean = false;

  segment: string;
  // adicionar botao voltar para trás true -> sim, false -> nao (depende da vista)
  has_back_button: boolean;

  typeUser: string;
  type;
  ticket;
  dateC;
  datecS;

  constructor(
    private activateRoute: ActivatedRoute,
    public navCtrl: NavController,
    private router: Router) { }

  async ngOnInit() {

    this.activateRoute.paramMap.subscribe((paramMap) => {
      this.typeUser = paramMap.get('type');

    });

    if (this.typeUser === 'STUDENT') {
      this.type = 0;
    }
    else {
      this.type = 1;
    }

    this.view_name = "Apresentar Senhas";
    this.card_type = "search_tickets";
    this.has_back_button = true;
    this.show_counter = false;

    const ss = SecureStorage.instantiateSecureStorage();

    let dataAuth = await SecureStorage.get('dataAuth', ss).then(dataUser => {
      return JSON.parse(dataUser);
    });

    let tickets = await SecureStorage.get('tickets', ss).then(result => {
      return JSON.parse(result);
    });
    console.log('tipo user', this.type)
    console.log('teste', tickets)
    const c = consts.completaP[this.type]
    console.log('here senhas completas promocionais', tickets.promotional[c])

    let count = this.getData(tickets, this.type);
    console.log('here', count);
    console.log('here', count);



    if((count[0][2] == 0) && (count[0][3] == 0) ){
      if (count[0][0] != 0) {
        const ticket = {
          "username": dataAuth['username'],
          "type": consts.completa[this.type],
          "date": false
        }
        this.items.push({
          count: count[0][0], type_ticket: "Senha completa.", descripton: "Dá-te direito ao prato principal, sopa, uma bebida e sobremesa.", url: '/holder-ble-transfer', args: {user: JSON.stringify(ticket), data_name: "senha", mso: "", option: 1}});
      }
  
      if (count[0][1] != 0) {
        const ticket = {
          "username": dataAuth['username'],
          "type": consts.simples[this.type],
          "date": false
        }
        this.items.push({
          count: count[0][1], type_ticket: "Senha prato simples.", descripton: "Dá-te direito ao prato principal e uma bebida.", url: '/holder-ble-transfer',args: {user: JSON.stringify(ticket), data_name: "senha", mso: "",option: 1 }});
      }
    }
   else {
      let date = new Date()
      if(count[0][2]!=0){
        const ticket = {
          "username": dataAuth['username'],
            "type": consts.simplesP[this.type],
            "date": true,
            "debugdate":date.toISOString()
        }
        this.items.push({ count: count[0][2], type_ticket: "Senha do dia prato simples.", descripton: "Dá-te direito ao prato principal, sopa, uma bebida e sobremesa.", date: 'Hoje', url: '/holder-ble-transfer', args: {user: JSON.stringify(ticket), data_name: "senha", mso: "", option: 1}});
      }
      if(count[0][3]!=0){
        const ticket = {
            "username": dataAuth['username'],
            "type": consts.completaP[this.type],
            "date": true,
            "debugdate":date.toISOString()
        }
          this.items.push({ count: count[0][3], type_ticket: "Senha do dia completa.", descripton: "Dá-te direito ao prato principal, sopa, uma bebida e sobremesa.", date: 'Hoje' , url: '/holder-ble-transfer', args: {user: JSON.stringify(ticket), data_name: "senha", mso: "", option: 1}});  
      }
    }
    
    this.dataLoaded = true;

  }


  getData(tickets, type) {

    const today = this.getCurrentDate()
    let counts = []

    counts.push(tickets[consts.completa[type]])
    console.log('senha completa', tickets[consts.completa[type]])
    counts.push(tickets[consts.simples[type]])


    const vetPromSimples = tickets.promotional[consts.simplesP[type]];
    const numSimples = this.getTicketPromotion( vetPromSimples, today);
    counts.push(numSimples);

    const vetPromCompl = tickets.promotional[consts.completaP[type]];
    const numComplete = this.getTicketPromotion( vetPromCompl, today);
    counts.push(numComplete);


    return [counts]
  }


  getTicketPromotion(vet_ticket,today) {
    let number = 0;
    for (let index = 0; index < vet_ticket.length; index++) {
      if (Date.parse(vet_ticket[index]) === Date.parse(today)) {
        let date = new Date(vet_ticket[index])
        console.log(date.toISOString())
        number+=1;
      }
    }
    return number;
  }

  getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const moth = date.getMonth() + 1;
    const day = date.getDate();
    let valueMoth = '';
    let valueDay = '';
    valueMoth = ((moth < 10) ? '0' : '').concat(moth.toString())
    valueDay = ((day < 10) ? '0' : '').concat(day.toString())
    const today = year.toString().concat('-').concat(valueMoth).concat('-').concat(valueDay)
    return today;
  }



  goBack(_event) {
    this.router.navigate(['/canteen', { userType: 'STUDENT' }]);
  }


  nextPage(_event) {
    console.log(_event);
    const ev = JSON.parse(_event);
    console.log(ev)
    if (ev.args) {
      this.navCtrl.navigateRoot([ev.url, ev.args]);
    }
    else this.navCtrl.navigateRoot([ev.url]);
  }

  getUseTicket() {

  }


}
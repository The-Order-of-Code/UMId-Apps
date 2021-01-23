import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { simples } from 'src/common/general/constants.js';
import * as SecureStorage from '../../../common/general/secureStorage.js';
import { TicketsService } from '../../../services/tickets.service';

@Component({
  selector: 'app-buy-ticket',
  templateUrl: './buy-ticket.page.html',
  styleUrls: ['./buy-ticket.page.scss'],
})
export class BuyTicketPage implements OnInit {
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

  ticketsCount = [];
  numberSimplesTicket;
  numberCompleteTicket;
  quantity;
  promo_tickets: any;

  constructor(
    private activateRoute: ActivatedRoute,
    public navCtrl: NavController,
    public alertController: AlertController,
    private router: Router,
    private storage: Storage,
    private ticketsService: TicketsService) { }

  ngOnInit() {
    this.activateRoute.paramMap.subscribe(
      paramMap => {
        this.view_name = "Comprar Senhas";
        this.card_type = "buy_tickets";
        this.has_back_button = true;
        this.show_counter = false;
        this.items.push({ type_ticket: "Senha completa.", descripton: "Dá-te direito ao prato principal, sopa, uma bebida e sobremesa." });
        this.items.push({ type_ticket: "Senha prato simples.", descripton: "Dá-te direito ao prato principal e uma bebida." });
        if(paramMap.has('promo_tickets') && paramMap.has('quantity')) {
          this.items.push({ type_ticket: "Senha do dia.", descripton: "Dá-te direito ao prato principal, sopa, uma bebida e sobremesa.", date: "24-01-2020", selected: paramMap.get('quantity') + " senhas adicionadas", url: '/canteen/buy-ticket/information' });
          this.promo_tickets = JSON.parse(paramMap.get('promo_tickets'));
          console.log(this.promo_tickets);
        }
        else this.items.push({ type_ticket: "Senha do dia.", descripton: "Dá-te direito ao prato principal, sopa, uma bebida e sobremesa.", date: "24-01-2020", selected: "0 senhas adicionadas", url: '/canteen/buy-ticket/information' });
        this.dataLoaded = true;
      }
    )
  }

  goBack(_event) {
    this.router.navigate(['/canteen', { userType: 'STUDENT' }]);
  }



  nextPage(_event) {
    console.log(_event);
    this.verifierIsNull();
    this.storage.set('tickets_simples', this.numberSimplesTicket);
    this.storage.set('tickets_complete', this.numberCompleteTicket);
    const ev = JSON.parse(_event);
    console.log(ev)
    if (ev.args) {
      this.navCtrl.navigateRoot([ev.url, ev.args]);
    }
    else this.navCtrl.navigateRoot([ev.url]);
  }

  reciveTickets($event) {
    console.log('value from child component', $event);
  }


  async buytTickets() {

    const ss = SecureStorage.instantiateSecureStorage();
    let dataAuth = await SecureStorage.get('dataAuth', ss).then(dataUser => {
      return JSON.parse(dataUser);
    });

    let nSimples = await this.storage.get('tickets_simples').then(result=>{
      return result;
    });

    let nCompleta = await this.storage.get('tickets_complete').then(result=>{
      return result;
    });

      let data = { 
        "username": dataAuth['username'], 
        "tickets": [
        {
              "ticketType": "Senha completa (estudante)",
              "amount": parseInt(nCompleta["count"])
        },
        {
              "ticketType": "Senha prato simples (estudante)",
              "amount": parseInt(nSimples["count"])
        },
        this.promo_tickets[0],
        this.promo_tickets[1]
      ]
  }

      let result =  await this.ticketsService.buyTickets(dataAuth['username'], dataAuth['password'],data).then(result=>{
        this.ticketsService.addTickets(data);
        return result.status;
      });

      if (result == 200){
        this.presentAlert("Compra de senhas realizado com sucesso.")
      }

  }



  inputKeyDownEnter(event) {
    this.ticketsCount.push(event);
    this.updateCountTicket();
  }

  /**
   * Atualiza os valores inseridos pelo utilizador 
   *
   * @memberof BuyTicketPage
   */
  updateCountTicket() {
    let i = this.ticketsCount.length
    if (this.ticketsCount[i - 1].type === "Senha completa.") {
      this.numberCompleteTicket = this.ticketsCount[i - 1]
      this.storage.set('tickets_complete', this.numberCompleteTicket);
    }
    else{
      this.numberSimplesTicket = this.ticketsCount[i - 1]
      this.storage.set('tickets_simples', this.numberSimplesTicket);
    }
      

    this.verifierIsNull();

    console.log('complete', this.numberCompleteTicket)
    console.log('simples', this.numberSimplesTicket)
  }



  verifierIsNull() {
    if (this.numberCompleteTicket === undefined || this.numberCompleteTicket === null) {
      this.numberCompleteTicket = { type: "Senha completa.", count: "0" }
      this.storage.set('tickets_complete', this.numberCompleteTicket);
    }
    if (this.numberSimplesTicket === undefined || this.numberSimplesTicket === null) {
      this.numberSimplesTicket = { type: "Senha prato simples.", count: "0" }
      this.storage.set('tickets_simples', this.numberSimplesTicket);
    }
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Aviso',
      message: message,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.navCtrl.navigateRoot(['/canteen',{userType: 'STUDENT'}]);
        }
      }]
    });

    await alert.present();
  }

}
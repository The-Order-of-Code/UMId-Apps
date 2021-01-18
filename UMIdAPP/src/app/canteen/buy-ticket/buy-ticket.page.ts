import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';

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

  constructor(
    private activateRoute: ActivatedRoute,
    public navCtrl: NavController,
    private router: Router,
    private authService: AuthService,) { }

  ngOnInit() {
    this.view_name = "Comprar Senhas";
    this.card_type = "buy_tickets";
    this.has_back_button = true;
    this.show_counter = false;
    this.items.push({ type_ticket: "Senha completa.", descripton: "Dá-te direito ao prato principal, sopa, uma bebida e sobremesa." });
    this.items.push({ type_ticket: "Senha prato principal.", descripton: "Dá-te direito ao prato principal e uma bebida." });
    this.items.push({ type_ticket: "Senha do dia.", descripton: "Dá-te direito ao prato principal, sopa, uma bebida e sobremesa.", date: "24-01-2020",selected:"1 senhas adicionadas", url:'/canteen/buy-ticket/information'} );
    this.dataLoaded = true;
  }

  goBack(_event) {
    this.router.navigate(['/canteen', { userType: 'STUDENT' }]);
  }



  nextPage(_event){
    console.log(_event);
    const ev = JSON.parse(_event); 
    console.log(ev)
    if(ev.args){
      this.navCtrl.navigateRoot([ev.url, ev.args]);
    }
    else this.navCtrl.navigateRoot([ev.url]);
  }

  reciveTickets($event){
    console.log('value from child component',$event);
  }

  buytTickets(){
    const username = "pg39261";
    const password = "123456";
    const data = {
      "username": username,
      "tickets": [
        {
          "ticketType": "Senha completa (estudante)",
          "amount": 1
        },
        {
          "ticketType": "Senha prato simples (estudante)",
          "amount": 1

        },
        {
          "ticketType": "Senha prato simples promocional (estudante)",
          "dates": [
            "2021-01-18T01:28:31.164501Z",

          ]
        }
      ]
    }

    this.authService.buyTickets(username,password,data).then(result=>{
      console.log(result.status)
    })
  }
}
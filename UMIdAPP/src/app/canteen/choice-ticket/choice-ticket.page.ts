import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

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

  constructor(
    private activateRoute: ActivatedRoute,
    public navCtrl: NavController,
    private router: Router) { }

  ngOnInit() {
    this.view_name = "Consultar Senhas";
    this.card_type = "consultar senhas";
    this.has_back_button = true;
    this.show_counter = false;

    const datahoje = new Date(2021, 1, 12);
    const teste = this.compareDate(datahoje);
    console.log('resultado da comparação', teste);
    const ticket = {
      "username": "a82145",
      "type": "Senha completa (estudante)",
      "date": true,
      "debugdate": "2041-11-25T01:28:31.164501Z"
    }

    const ticket1 = {
      "username": "a82145",
      "type": "Senha prato principal (estudante)",
      "date": false
    }

    this.items.push({ count: 8, type_ticket: "Senha completa.", descripton: "Dá-te direito ao prato principal, sopa, uma bebida e sobremesa.", url: '/holder-ble-transfer', args: { user: JSON.stringify(ticket), data_name: "senha" , option: 1}});
    this.items.push({ count: 2, type_ticket: "Senha prato principal.", descripton: "Dá-te direito ao prato principal e uma bebida.", url: '/holder-ble-transfer', args: { user: JSON.stringify(ticket1), data_name: "senha" , option: 1}});
 
    this.dataLoaded = true;
  }

  goBack(_event) {
    this.router.navigate(['/canteen', { userType: 'STUDENT' }]);
  }

  compareDate(date) {
    let today = new Date()
    return date >= today ? true : false
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




}
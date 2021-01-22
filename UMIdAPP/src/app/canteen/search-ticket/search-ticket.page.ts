import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import * as SecureStorage from '../../../common/general/secureStorage.js';
import * as consts from 'src/common/general/constants';

@Component({
  selector: 'app-search-ticket',
  templateUrl: './search-ticket.page.html',
  styleUrls: ['./search-ticket.page.scss'],
})
export class SearchTicketPage implements OnInit {
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
  user: string;

  constructor(
    private activateRoute: ActivatedRoute,
    public navCtrl: NavController,
    private router: Router) { }

  ngOnInit() {
    this.view_name = "Consultar Senhas";
    this.card_type = "search_tickets";
    const ss = SecureStorage.instantiateSecureStorage();
    const type = 0;
    const interval = 2;
    SecureStorage.get('tickets', ss).then(result => {
      const [count, ticketDay] = this.getData(JSON.parse(result), type, interval);
      let day = new Date(ticketDay)
      this.items.push({ count: count[0], type_ticket: "Senha completa.", descripton: "Dá-te direito ao prato principal, sopa, uma bebida e sobremesa." });
      this.items.push({ count: count[1], type_ticket: "Senha simples.", descripton: "Dá-te direito ao prato principal e uma bebida." });
      this.items.push({ count: count[2], type_ticket: "Senha do dia.", descripton: "Esta senha é a senha promocional das duas categorias acima ", date: day.toLocaleDateString() });
      this.dataLoaded = true;
    })
    this.has_back_button = true;
    this.show_counter = false;
  }


  /**
   *  Retorna a quantidade de cada tipo de senha e a data da proxima promocional se houver 
   *
   * @param {*} tickets objecto json armazenado no SecureStorage
   * @param {*} type tipo do utilizador se for estudante é 0 se for funcionario 1
   * @param {*} interval quantidade de dias a frente  que se quer investigar se há senha promocional
   * @return {*} 
   * @memberof SearchTicketPage
   */
  getData(tickets, type, interval) {

    const days = this.getCurrentDate(interval)
    let counts = []

    counts.push(tickets[consts.completa[type]])
    counts.push(tickets[consts.simples[type]])


    const vetPromSimples = tickets.promotional[consts.simplesP[type]];
    const vetPromCompl = tickets.promotional[consts.completaP[type]];
    const countPromotions = vetPromSimples.concat(vetPromCompl);
    counts.push(countPromotions.length)

    const ticketDay = this.getTicketPromotion(vetPromSimples, vetPromCompl, days);
    return [counts, ticketDay]
  }


  goBack(_event) {
    this.router.navigate(['/canteen', { userType: 'STUDENT' }]);
  }

  /**
   * Pega a data da senha promocional mais próxima para exibir 
   *
   * @param {*} vetS vetor de senhas promocionais prato simples
   * @param {*} vetC vetor de senhas promocionais completas 
   * @param {*} days  quantidade de dias de busca a frente
   * @return {*} 
   * @memberof SearchTicketPage
   */
  getTicketPromotion(vetS, vetC, days) {
    const vet = vetS.concat(vetC);
    const today = Date.now();
    if (vet.length > 0) {
      let present = days[0];
      for (let index = 0; index < vet.length; index++) {
        if ((Date.parse(vet[index]) >= Date.parse(days[0])) && (Date.parse(vet[index]) <= Date.parse(days[1])) || (Date.parse(vet[index]) >= today ) ) {
          present = vet[index]
        }
        if (Date.parse(present) > Date.parse(vet[index]) && (Date.parse(vet[index]) >= today ) ) {
          present = vet[index]
        }
        if ( Date.parse(vet[index])  == today  ){
          present = vet[index]
        }
      }
      return present;
    }
    else return "Passou prazo das suas senhas ou não possui."
  }

  /**
   * Retorna o dia de hoje e o dia a frente a depender do numero de dias a frente que quer exemplo
   * 
   * @param {*} days numero de dias a frente exemplo 2
   * @return {*}  today = 21/01/2021 o tomorrow será 23/01/2021
   *
   * @memberof SearchTicketPage
   */
  getCurrentDate(days) {
    const date = new Date();
    const year = date.getFullYear();
    const moth = date.getMonth() + 1;
    const day = date.getDate();

    let valueMoth = '';
    let valueDay = '';
    valueMoth = ((moth < 10) ? '0' : '').concat(moth.toString())
    valueDay = ((day < 10) ? '0' : '').concat(day.toString())
    const today = year.toString().concat('-').concat(valueMoth).concat('-').concat(valueDay)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + days)
    return [today, tomorrow];
  }


}

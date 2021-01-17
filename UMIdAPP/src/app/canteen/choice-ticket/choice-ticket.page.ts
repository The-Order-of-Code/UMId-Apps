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



  constructor(
    private activateRoute: ActivatedRoute,
    public navCtrl: NavController,
    private router: Router) { }

  ngOnInit() {
    this.view_name = "Consultar Senhas";
    this.card_type = "consultar senhas";
    this.has_back_button = true;
    this.show_counter = false;

    const ss = SecureStorage.instantiateSecureStorage();
    const type = 0;
    SecureStorage.get('tickets', ss).then(result => {
      const [count,listPRo] = this.getData(JSON.parse(result), type);
      if((listPRo[0]!=0) || (listPRo[1]!=0) ){
        this.items.push({ count: count[3], type_ticket: "Senha do dia completa.", descripton: "Dá-te direito ao prato principal, sopa, uma bebida e sobremesa.", date: 'Hoje' , url: '/holder-ble-transfer', args: { user: 'STUDENT', data_name: "senha", content:consts.completaP[type]}});
        this.items.push({ count: count[2], type_ticket: "Senha do dia prato simples.", descripton: "Dá-te direito ao prato principal, sopa, uma bebida e sobremesa.", date: 'Hoje', url: '/holder-ble-transfer', args: { user: 'STUDENT', data_name: "senha", content:consts.simplesP[type]}});
        this.dataLoaded = true;
      }
      else{
        this.items.push({ count: count[0], type_ticket: "Senha completa.", descripton: "Dá-te direito ao prato principal, sopa, uma bebida e sobremesa.", url: '/holder-ble-transfer', args: { user: 'STUDENT', data_name: "senha", content:"Senha completa."} });
        this.items.push({ count: count[1], type_ticket: "Senha prato simples.", descripton: "Dá-te direito ao prato principal e uma bebida.", url: '/holder-ble-transfer', args: { data_name: "senha", content:"Senha prato principal."}  });
        this.dataLoaded = true;
      }
    })

  }


  getData(tickets, type) {

    const today = this.getCurrentDate()
    let counts = []
  
    counts.push(tickets[consts.completa[type]])
    counts.push(tickets[consts.simples[type]])
  
  
    const vetPromSimples = tickets.promotional[consts.simplesP[type]];
    const vetPromCompl = tickets.promotional[consts.completaP[type]];
    
    counts.push(vetPromSimples.length)
    counts.push(vetPromCompl.length)
  
    const listPRo = this.getTicketPromotion(vetPromSimples, vetPromCompl, today);
    return [counts, listPRo]
  }

  
  getTicketPromotion(vetS, vetC, today) {
    const vet = vetS.concat(vetC);
    console.log('ver',vet)
    let listPRo=[0,0]
    for (let index = 0; index < vet.length; index++) {
      if( (Date.parse(vet[index]) === Date.parse(today)) && (index<vetS.length) ) {
        listPRo[0]++;
      }
    
    if ( (Date.parse(vet[index]) === Date.parse(today)) && (index>vetS.length) ){
      listPRo[1]++;
    }
  }
    return listPRo;
  
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
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-search-ticket',
  templateUrl: './search-ticket.page.html',
  styleUrls: ['./search-ticket.page.scss'],
})
export class SearchTicketPage implements OnInit {
  // nome da vista 
  view_name : string;

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
    this.card_type="consultar senhas";
    this.has_back_button = true;
    this.show_counter = false;
    this.items.push({count:8,type_ticket:"Senha completa.",descripton:"Dá-te direito ao prato principal, sopa, uma bebida e sobremesa."});
    this.items.push({count:2,type_ticket:"Senha prato principal.",descripton:"Dá-te direito ao prato principal e uma bebida."});
    this.items.push({count:2,type_ticket:"Senha do dia.",descripton:"Dá-te direito ao prato principal, sopa, uma bebida e sobremesa.", date:"24-01-2020"});
    this.dataLoaded = true;
  }

  goBack(_event){
    this.router.navigate(['/canteen',{ userType: 'STUDENT'}]);
  }

  

}

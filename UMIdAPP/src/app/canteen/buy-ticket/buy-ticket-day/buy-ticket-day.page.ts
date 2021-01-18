import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit() {
    this.view_name = "Senha do dia";
    this.has_back_button = true;
    this.show_counter = true;
    this.card_type = "senhas"
  
    this.operation_name = "adicionadas";
    this.items.push("15/01/2021");
    this.items.push("16/01/2021");
    this.dataLoaded = true; 
  
  }

  goBack(_event){
    this.router.navigate(['/canteen/buy-ticket/information',{ user_info: 1}]);
  }

}

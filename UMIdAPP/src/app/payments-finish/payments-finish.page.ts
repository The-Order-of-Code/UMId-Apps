import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payments-finish',
  templateUrl: './payments-finish.page.html',
  styleUrls: ['./payments-finish.page.scss'],
})
export class PaymentsFinishPage implements OnInit {
  // nome da página (Cantina, Biblioteca, etc.)
  view_name: string;

  // adicionar botao voltar para trás true -> sim, false -> nao (depende da vista)
  has_back_button: boolean;

  show_counter: boolean;

  segment: string;
  items: Object[] = [];
  dataLoaded: boolean;

  card_type: string;
  payments: Object[] = [];
  paid: Object[] = [];
  text_pay: string;
  total_value: string;
  title_description: string;
  title_count: string;
  title_value: string;
  show_pay: boolean;
  text_select: string;
  activateRoute: any;

  constructor(private router: Router,) { }

  ngOnInit() {
    this.show_counter = false;
    this.card_type = "payments-finish"
    this.has_back_button = true;
    this.dataLoaded = true;
    this.view_name = "Meio de pagamento"
    this.text_pay = "Valor em pagamento:"
    this.total_value= 92.65+"€"
    this.title_description= "Descrição:"
    this.title_count=" Quantidade:"
    this.title_value="Valor:"

    this.items.push({description:"Senha normal",count:1,value:2.50+"€"})
    this.items.push({description:"Senha do dia",count:2,value:2.00+"€"})
    this.items.push({description:"3° prestação de propinas ",count:1,value:87.15+"€"})
    this.items.push({description:"Senha normal",count:1,value:2.50+"€"})
    this.items.push({description:"Senha do dia",count:2,value:2.00+"€"})
    this.items.push({description:"3° prestação de propinas ",count:1,value:87.15+"€"})
    this.items.push({description:"Senha normal",count:1,value:2.50+"€"})
    this.items.push({description:"Senha do dia",count:2,value:2.00+"€"})
    this.items.push({description:"3° prestação de propinas ",count:1,value:87.15+"€"})
    this.items.push({description:"Senha normal",count:1,value:2.50+"€"})
    this.items.push({description:"Senha do dia",count:2,value:2.00+"€"})
    this.items.push({description:"3° prestação de propinas ",count:1,value:87.15+"€"})
    //rodape da pagina
    this.show_pay = true;
    this.text_select = "Selecione o meio de pagamento:";
  
  }


  goBack(_event) {
    this.router.navigate(['/home', { user_info: 1 }]);
  }

}

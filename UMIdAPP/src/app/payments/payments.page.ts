import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit {
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

  constructor(private router: Router) { }

  ngOnInit() {
    // A view para proprinas  
    this.view_name = "Pagamentos";
    this.show_counter = false;
    this.card_type = "payments"
    this.has_back_button = true;
    this.options("payments");
    this.dataLoaded = true;
    this.payments.push({ value: 87.15, n_propinas: "11° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/12/2020" });
    this.payments.push({ value: 87.15, n_propinas: "12° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/01/2021" });
    this.paid.push({ value: 87.15, n_propinas: "1° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/12/2020" });
    this.paid.push({ value: 87.15, n_propinas: "2° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/01/2021" });
    this.paid.push({ value: 87.15, n_propinas: "3° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/12/2020" });
    this.paid.push({ value: 87.15, n_propinas: "4° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/01/2021" });
    this.paid.push({ value: 87.15, n_propinas: "5° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/12/2020" });
    this.paid.push({ value: 87.15, n_propinas: "6° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/01/2021" });
    this.paid.push({ value: 87.15, n_propinas: "7° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/12/2020" });
    this.paid.push({ value: 87.15, n_propinas: "8° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/01/2021" });
    this.paid.push({ value: 87.15, n_propinas: "9° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/12/2020" });
    this.paid.push({ value: 87.15, n_propinas: "10° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/01/2021" });
  }

  options(card) {
    console.log(card)
    
    this.card_type = card;
    if (card == "payments") {
      this.items = this.payments;
    }
    else if(card == "paid"){
      this.items = this.paid;
      
    }
  }

  goBack(_event) {
    this.router.navigate(['/home', { user_info: 1 }]);
  }

}

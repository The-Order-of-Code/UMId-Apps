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

  constructor( private router: Router,) { }

  ngOnInit() {
    // A view para proprinas  
    this.view_name = "Pagamentos";
    this.show_counter = false;
    this.has_back_button = true;
    this.items.push({ value: 87.15, n_propinas: "3° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/12/2020" });
    this.items.push({ value: 87.15, n_propinas: "4° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/01/2021" });
    this.items.push({ value: 87.15, n_propinas: "3° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/12/2020" });
    this.items.push({ value: 87.15, n_propinas: "4° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/01/2021" });
    this.items.push({ value: 87.15, n_propinas: "3° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/12/2020" });
    this.items.push({ value: 87.15, n_propinas: "4° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/01/2021" });
    this.items.push({ value: 87.15, n_propinas: "3° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/12/2020" });
    this.items.push({ value: 87.15, n_propinas: "4° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/01/2021" });
    this.items.push({ value: 87.15, n_propinas: "3° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/12/2020" });
    this.items.push({ value: 87.15, n_propinas: "4° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/01/2021" });
    this.items.push({ value: 87.15, n_propinas: "3° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/12/2020" });
    this.items.push({ value: 87.15, n_propinas: "4° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/01/2021" });
    
  }

  options(teste){
    console.log('teste',teste);
    this.card_type=teste;
    this.dataLoaded = true;
  }

  goBack(_event){
    this.router.navigate(['/home',{ user_info: 1}]);
  }

}

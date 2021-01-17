import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';

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
  n_propinas: string;
  ano: string;
  value: number;

  constructor( private activateRoute: ActivatedRoute,
    public navCtrl: NavController,
    private router: Router,
    private menu: MenuController) { }

  ngOnInit() {
    // A view para proprinas  
    this.view_name = "Pagamentos";
    this.show_counter = false;
    this.card_type = "payments"
    this.has_back_button = true;
    this.options("payments");
    this.dataLoaded = true;
    
    this.ano = "(2020/2021)"
    this.n_propinas ="11° PRESTAÇÃO DE PROPINAS";
    this.value = 87.15;
    
    this.payments.push({ value: 87.15, n_propinas: "11° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/12/2020", url: '/payments-finish'});
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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  // nome da página (Cantina, Biblioteca, etc.)
  view_name: string;
  
  // adicionar botao voltar para trás true -> sim, false -> nao (depende da vista)
  has_back_button: boolean;

  show_counter: boolean;

  segment: string;
  items: Object[] = [];
  dataLoaded:boolean;

  card_type: string;

  constructor(private router: Router) { }

  ngOnInit() {
    this.view_name = "Notificações";
    this.show_counter = false;
    this.has_back_button = true;
    this.segment = 'notifications';
    this.dataLoaded = true;
    this.items.push({icon_name:"restaurant",descripton:"Amanhã deve-se utilizar sua senha do dia, para não perdê-la.", type:"Urgente"});
    this.items.push({icon_name:"wallet",descripton:"Pagamento da sua propina referente ao mês de janeiro vence daqui a 10 dias.", type:"Atenção"});
    this.items.push({icon_name:"library",descripton:"Sua reserva da sala 2 campus Gualtar as 14 horas iniciará dentre 10 mins.", type:"Urgente"});
    this.items.push({icon_name:"restaurant",descripton:"Foi atualizado seu número de senhas da cantina.", type:"Informativo"});
    this.items.push({icon_name:"restaurant",descripton:"Seu saldo de senhas está para terminar.", type:"Urgente"});
    this.items.push({icon_name:"wallet",descripton:"Pagamento da sua propina referente ao mês de janeiro vence daqui a 10 dias.", type:"Atenção"});
    this.card_type='notify'
  }
  
  goBack(_event){
    this.router.navigate(['/home',{ user_info: 1}]);
  }
  
}

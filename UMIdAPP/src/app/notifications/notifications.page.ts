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

  constructor(private router: Router) { }

  ngOnInit() {
    this.view_name = "Notificações";
    this.show_counter = false;
    this.has_back_button = true;
    this.segment = 'notifications';
  }
  
  goBack(_event){
    this.router.navigate(['/home',{ user_info: 1}]);
  }
  
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.page.html',
  styleUrls: ['./authorization.page.scss'],
})
export class AuthorizationPage implements OnInit {
  // nome da página (Cantina, Biblioteca, etc.)
  view_name: string;

  // adicionar botao voltar para trás true -> sim, false -> nao (depende da vista)
  has_back_button: boolean;

  show_counter: boolean;

  segment: string;
  dataLoaded: boolean = false;

  info: string;
  sub_info: string;
  request_attributes :string[] = [];;
  spinner: boolean;
  loading_message: string;
  icon_name: string;

  constructor(private router: Router) { }

  ngOnInit() {
    this.loading_message = "a transferir dados";
    this.dataLoaded = true;
    this.spinner = true;
    this.icon_name = "card"
  }


  goBack(_event) {
    this.router.navigate(['/home', { user_info: 1 }]);
  }

}

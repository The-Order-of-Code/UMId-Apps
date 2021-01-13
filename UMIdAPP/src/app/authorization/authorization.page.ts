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
 
  shared_other: boolean;
  icon_name: string;
  card_type: string;
  items: Object[] = [];

  constructor(private router: Router) { }

  ngOnInit() {

    this.view_name = "Autorizar";
    this.has_back_button = true;
    this.icon_name = "restaurant";
    this.info = "O leitor solicitou isso:";
    this.sub_info = "você autoriza?"
    this.request_attributes.push("Nome");
    this.request_attributes.push("Idade");
    console.log('lista de atributos',this.request_attributes)
    this.shared_other = false;
    this.dataLoaded = true;
    this.show_counter = false;
  


  }


  goBack(_event) {
    this.router.navigate(['/home', { user_info: 1 }]);
  }

}

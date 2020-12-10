import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // nome da página (Cantina, Biblioteca, etc.)
  view_name: string;

  // primeiro nome do aluno 
  first_name: string;

  // adicionar botao voltar para trás true -> sim, false -> nao (depende da vista)
  has_back_button: boolean;
  
  constructor() {
    this.view_name = "Pagina Inicial";
    this.first_name = "Joana";
    this.has_back_button = true;
  }
  
  goBack(_event) {
    console.log(_event);
  }

}

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
  
  // lista com items do que queremos colocar na view (designação, datas, horários, etc.)
  items: Object[] = [];

  show_counter: boolean;

  prod_name: string;

  quantity: number;
  
  operation_name: string;

  card_type: string; 

  constructor() {
    /**
     * só um pequeno exemplo para testar
     */
    this.view_name = "Reservar";
    this.first_name = "Joana";
    this.has_back_button = true;
    this.show_counter = true;
    this.quantity = 2;
    this.card_type = "slots";
    this.prod_name = "slots";
    this.operation_name = "adicionados";
    this.items.push("14:00h - 14:30h")
    this.items.push("14:30h - 15:00h")
    this.items.push("15:00h - 15:30h")
    this.items.push("15:30h - 16:00h")
    this.items.push("16:00h - 16:30h")
    this.items.push("16:30h - 17:00h")
    this.items.push("17:00h - 17:30h")
    this.items.push("17:30h - 18:00h")
  }
  
  goBack(_event) {
    console.log(_event);
  }

}

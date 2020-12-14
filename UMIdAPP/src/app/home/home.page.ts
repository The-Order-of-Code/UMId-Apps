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
    // this.view_name = "Comprar senhas";
    // this.first_name = "Joana";
    // this.has_back_button = true;
    // this.show_counter = true;
    // this.quantity = 2;
    // // this.card_type = "main menu";
    // this.card_type = "senhas";
    // this.prod_name = "senhas";
    // this.operation_name = "adicionadas";

    // Senhas promocionais 
    // this.view_name = "Senha do dia";
    // this.has_back_button = true;
    // this.show_counter = true;
    // this.quantity = 2;
    // this.card_type = "senhas";
    // this.prod_name = "senhas";
    // this.operation_name = "adicionadas";
    // this.items.push("19/01/2020")
    // this.items.push("19/01/2020")
    // this.items.push("19/01/2020")
    // this.items.push("19/01/2020")
    // this.items.push("19/01/2020")
    // this.items.push("19/01/2020")

    // Reservas
    this.view_name = "Reservar";
    this.has_back_button = true;
    this.show_counter = true;
    this.quantity = 2;
    this.card_type = "slots_reservas";
    this.prod_name = "slots";
    this.operation_name = "adicionados";
    this.items.push("14:30h - 15:00h")
    this.items.push("15:00h - 15:30h")
    this.items.push("15:30h - 16:00h")
    this.items.push("16:00h - 16:30h")
    this.items.push("16:30h - 17:00h")
    this.items.push("17:00h - 17:30h")
    this.items.push("17:30h - 18:00h")

    // Menu inicial estudante
    // this.first_name = "Joana";
    // this.has_back_button = false;
    // this.show_counter = false;
    // this.card_type = "main menu";
    // this.items.push({name: "Cantina", icon_name: 'cantina'});
    // this.items.push({name: "Reserva de salas de estudo", icon_name: 'biblioteca'});
    // this.items.push({name: "Apresentar identificação", icon_name: 'cartao'});
    // this.items.push({name: "Pagamentos", icon_name: 'carteira'});
    // this.items.push({name: "Ver cartão", icon_name: 'perfil'});

    // Menu inicial funcionário cantina
    // this.first_name = "Joana";
    // this.has_back_button = false;
    // this.show_counter = false;
    // this.card_type = "main menu";
    // this.items.push({name: "Verificar senha", icon_name: 'verificar senha'});
    // this.items.push({name: "Verificar identificação", icon_name: 'verificar identidade'});
    // this.items.push({name: "Cantina", icon_name: 'cantina'});
    // this.items.push({name: "Apresentar identificação", icon_name: 'cartao'});
    // this.items.push({name: "Ver cartão", icon_name: 'perfil'});

    // Menu inicial funcionário biblioteca
    // this.first_name = "Joana";
    // this.has_back_button = false;
    // this.show_counter = false;
    // this.card_type = "main menu";
    // this.items.push({name: "Verificar reserva", icon_name: 'verificar reserva'});
    // this.items.push({name: "Verificar identificação", icon_name: 'verificar identidade'});
    // this.items.push({name: "Cantina", icon_name: 'cantina'});
    // this.items.push({name: "Reserva de salas de estudo", icon_name: 'biblioteca'});
    // this.items.push({name: "Apresentar identificação", icon_name: 'cartao'});
    // this.items.push({name: "Ver cartão", icon_name: 'perfil'});

    // Menu inicial professor
    // this.first_name = "Joana";
    // this.has_back_button = false;
    // this.show_counter = false;
    // this.card_type = "main menu";
    // this.items.push({name: "Verificar identificação", icon_name: 'verificar identidade'});
    // this.items.push({name: "Cantina", icon_name: 'cantina'});
    // this.items.push({name: "Reserva de salas de estudo", icon_name: 'biblioteca'});
    // this.items.push({name: "Apresentar identificação", icon_name: 'cartao'});
    // this.items.push({name: "Ver Cartão", icon_name: 'perfil'});

  }
  
  goBack(_event) {
    console.log(_event);
  }

}

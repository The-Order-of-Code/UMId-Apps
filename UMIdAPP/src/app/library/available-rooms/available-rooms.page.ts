import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-available-rooms',
  templateUrl: './available-rooms.page.html',
  styleUrls: ['./available-rooms.page.scss'],
})
export class AvailableRoomsPage implements OnInit {

  // nome da página (Cantina, Biblioteca, etc.)
  view_name: string;

  // adicionar botao voltar para trás true -> sim, false -> nao (depende da vista)
  has_back_button: boolean;
  
  // lista com items do que queremos colocar na view (designação, datas, horários, etc.)
  items: Object[] = [];

  show_counter: boolean;

  card_type: string;

  dataLoaded: boolean = false;
  constructor(private router: Router) { }

  ngOnInit() {
    this.items = [];
    // salas disponiveis
    this.view_name = "Salas disponíveis";
    this.has_back_button = true;
    this.show_counter = false;
    this.card_type = "salas_disponiveis";
    let available_begin_date = new Date();
    available_begin_date.setDate(available_begin_date.getDate());
    console.log(available_begin_date.toISOString())
    this.items.push({name: "reserva", icon_name: 'calendario', room_name: "Sala 4", date: available_begin_date.toISOString() })
    available_begin_date.setDate(available_begin_date.getDate() + 1)
    this.items.push({name: "reserva", icon_name: 'calendario', room_name: "Sala 2", date: available_begin_date.toISOString() })
    available_begin_date.setDate(available_begin_date.getDate() + 2)
    this.items.push({name: "reserva", icon_name: 'calendario', room_name: "Sala 3", date: available_begin_date.toISOString() })
    this.dataLoaded = true;
  }

  goBack(_event){
    this.router.navigate(['/library',{ userType: 'STUDENT'}]);
  }
}

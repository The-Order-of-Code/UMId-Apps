import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reserve-finish',
  templateUrl: './reserve-finish.page.html',
  styleUrls: ['./reserve-finish.page.scss'],
})
export class ReserveFinishPage implements OnInit {
  room_name:string;
  date:any;

  // nome da página (Cantina, Biblioteca, etc.)
  view_name: string;


  // adicionar botao voltar para trás true -> sim, false -> nao (depende da vista)
  has_back_button: boolean;

  // lista com items do que queremos colocar na view (designação, datas, horários, etc.)
  items: Object[] = [];
  operation_name: string;
  prod_name: string;
  card_type: string;
  quantity: number;
  show_counter: boolean;
  dataLoaded: boolean;

  constructor(private activateRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {

    this.activateRoute.paramMap.subscribe(
      (paramMap) => {
        this.room_name = "Sala "+paramMap.get('name');
        this.date = paramMap.get('available')
      }
     );
    console.log('teste', this.date)
    this.view_name = 'Reservar';
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
    this.items.push("15:00h - 15:30h")
    this.items.push("15:30h - 16:00h")
    this.items.push("16:00h - 16:30h") 
    this.items.push("16:30h - 17:00h")
    this.items.push("17:00h - 17:30h")
    this.items.push("17:30h - 18:00h")
    this.dataLoaded = true;

  }

  goBack(_event){
    this.router.navigate(['/library/available-rooms/reserve',{ userType: 'STUDENT'}]);
  }

}

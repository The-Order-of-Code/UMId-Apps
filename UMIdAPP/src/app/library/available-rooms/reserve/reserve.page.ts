import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.page.html',
  styleUrls: ['./reserve.page.scss'],
})
export class ReservePage implements OnInit {
  room_name:string;
  date:any;

  // nome da página (Cantina, Biblioteca, etc.)
  view_name: string;


  // adicionar botao voltar para trás true -> sim, false -> nao (depende da vista)
  has_back_button: boolean;
  
  start_time;
  finish_time;
  date_reservation;



  constructor(private activateRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {

   this.activateRoute.paramMap.subscribe(
    (paramMap) => {
      this.room_name = "Sala "+paramMap.get('number_room');
      this.date = this.updateDate(paramMap.get('available'));
    }
   );
    // this.room_name ='Sala 4';
    // this.date = 'Hoje, até as 15:30h';
    this.view_name = 'Reservar';
    this.has_back_button = true;
    


  }

  showData(){
    console.log('data', this.date_reservation,' inicio', this.start_time, 'fim', this.finish_time);
  }

  goBack(_event){
    this.router.navigate(['/library/available-rooms',{ userType: 'STUDENT'}]);
  }

  timeNow(d) {
    const h = (d.getHours() < 10 ? '0' : '') + d.getHours()
    const m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    return h + ':' + m;
  }

  updateDate(d) {
    const date = new Date(d);
    const today = new Date();
    if (date.getDate() == today.getDate() && date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear()) {
      if (date.getHours() > today.getHours()) return "Disponível hoje, a partir das " + this.timeNow(date) + "h";
      else return "Sala disponível";
    }
    else {
      let tomorrow = new Date(today.toISOString());
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (date.getDate() == tomorrow.getDate() && date.getMonth() == tomorrow.getMonth() && date.getFullYear() == tomorrow.getFullYear()) {
        return "Disponível amanhã, a partir das " + this.timeNow(date) + "h";
      }
      else {
        return "Dia " + date.toLocaleDateString() + ", a partir das " + this.timeNow(date) + "h";
      }
    }
  }


}

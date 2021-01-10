import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.page.html',
  styleUrls: ['./check-in.page.scss'],
})
export class CheckInPage implements OnInit {

  // nome da página (Cantina, Biblioteca, etc.)
  view_name: string;

  // primeiro nome do aluno 
  first_name: string;

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
    // check-in  
    this.view_name = "Check-in";
    this.has_back_button = true;
    this.show_counter = false;
    this.card_type = "check_in";
    let begin_date = new Date();
    begin_date.setHours(19);
    begin_date.setMinutes(16);
    console.log(begin_date.toISOString())
    let end_date = new Date()
    end_date.setHours(20);
    end_date.setMinutes(20);
    this.items.push({name: "reserva", icon_name: 'calendario', room_name: "Sala 4", begin_date: begin_date.toISOString() , end_date: end_date.toISOString(), check_in: false})
    this.dataLoaded = true;
  
  }

  goBack(_event){
    this.router.navigate(['/library',{ userType: 'STUDENT'}]);
  }

}

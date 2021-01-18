import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { reservations } from 'src/common/general/constants.js';
import * as SecureStorage from '../../../common/general/secureStorage.js';

@Component({
  selector: 'app-next-reservations',
  templateUrl: './next-reservations.page.html',
  styleUrls: ['./next-reservations.page.scss'],
})
export class NextReservationsPage implements OnInit {

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
    // próximas reservas
    this.view_name = "Próximas reservas";
    this.has_back_button = true;
    this.show_counter = false;
    this.card_type = "proximas_reservas";
    const ss = SecureStorage.instantiateSecureStorage();
    SecureStorage.get('reservations',ss).then(reservations=>{
      const reservationsJSON = JSON.parse(reservations); 
      console.log('Reservas', reservationsJSON[0])
      reservationsJSON.forEach(element => {
        let begin_date = new Date(element['start'])
        let end_date = new Date(element['end']); 
        this.items.push({name: "reserva", icon_name: 'calendario', room_name: "Sala "+element['room'], begin_date: begin_date.toISOString() , end_date: end_date.toISOString(), check_in: false})  
      });
    });
    this.dataLoaded = true;
  }




  goBack(_event){
    this.router.navigate(['/library',{ userType: 'STUDENT'}]);
  }

}

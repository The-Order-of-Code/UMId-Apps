import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  




  constructor(private router: Router) { }

  ngOnInit() {
    this.room_name ='Sala 4';
    this.date = 'Hoje, até as 15:30h';
    this.view_name = 'Reservar';
    this.has_back_button = true;

  }

  goBack(_event){
    this.router.navigate(['/library/available-rooms',{ userType: 'STUDENT'}]);
  }

}

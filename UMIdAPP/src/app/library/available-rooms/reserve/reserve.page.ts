import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.page.html',
  styleUrls: ['./reserve.page.scss'],
})
export class ReservePage implements OnInit {
  room_name: string;
  date: any;

  // nome da página (Cantina, Biblioteca, etc.) 
  view_name: string;


  // adicionar botao voltar para trás true -> sim, false -> nao (depende da vista)
  has_back_button: boolean;

  start_time;
  finish_time;
  date_reservation;
  avaible_room;
  room_id: string;
  minTime = '08:00';
  maxTime = '22:00';
  hourValues = ['08','09','10','11','12','13','14','15','16','17','18','19','20','21','22'];

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router, 
    public alertController: AlertController) { }

  ngOnInit() {

    this.activateRoute.paramMap.subscribe(
      (paramMap) => {
        this.room_name = "Sala " + paramMap.get('number_room');
        this.avaible_room = paramMap.get('available')
        this.room_id =  paramMap.get('room_id');
        this.date = this.updateDate(paramMap.get('available'));
      }
    );

    this.view_name = 'Reservar';
    this.has_back_button = true;



  }

  searchAvailable() {
    console.log('data', this.date_reservation, ' inicio', this.start_time, 'fim', this.finish_time);
    let check = this.checkChoice(this.date_reservation, this.avaible_room, this.start_time, this.finish_time);
    if (check) {
      console.log('ok');
      this.router.navigate(['/library/available-rooms/reserve-finish', { name: this.room_name, room_id: this.room_id, available: this.avaible_room, start: this.start_time, end: this.finish_time}]);
    }
    else console.log('fail');
  }

  /**
   * Função valida a busca tenho a disponibilidade como parametro
   *
   * @param {*} date_reservation
   * @param {*} avaible_room
   * @param {*} start_time
   * @param {*} finish_time
   * @return {*} 
   * @memberof ReservePage
   */
  checkChoice(date_reservation, avaible_room, start_time, finish_time) {
    const date = new Date(date_reservation);
    const available = new Date(avaible_room);
    const start = new Date(start_time);
    const end = new Date(finish_time);

    if (date_reservation === undefined || start_time === undefined || finish_time === undefined){
      this.presentAlert('Todos os campos devem ser preenchidos.');
      return false;
    }
    else {
      if (date.getDate() < available.getDate() || date.getMonth() < available.getMonth() || date.getFullYear() < available.getFullYear()) {
        this.presentAlert("A data escolhida é posterior a disponibilidade da sala.");
        return false;
      }
      if ((start.getHours() < available.getHours()  || start.getMinutes() < available.getMinutes()) && date.getDate() === available.getDate() && available.getHours()>=8) {
        this.presentAlert(`A sala só está disponível depois das ${available.getHours()}:${available.getMinutes()}`);
        return false;
      }
      if (start.getHours() > end.getHours()) {
        this.presentAlert('Sua horário final é inferior ao horário de inicio escolhido');
        return false;
      }
      else return true;
    }

  }

  goBack(_event) {
    this.router.navigate(['/library/available-rooms', { userType: 'STUDENT' }]);
  }

  timeNow(d) {
    const h = (d.getHours() < 10 ? '0' : '') + d.getHours()
    const m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    return h + ':' + m;
  }

  updateDate(d) {
    const date = new Date(d);
    const today = new Date();
    console.log('Hoje ', date.getHours())
    console.log('Disponivel ', today.getHours())
    if ((date.getDate() == today.getDate()) && (date.getMonth() == today.getMonth()) && (date.getFullYear() == today.getFullYear())) {
      if (date.getHours() > today.getHours() || date.getMinutes() > today.getMinutes()) {
        return "Disponível hoje, a partir das " + this.timeNow(date) + "h";
      }
      else {
        return "Sala disponível";
      }
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

  async presentAlert(message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Aviso',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

}

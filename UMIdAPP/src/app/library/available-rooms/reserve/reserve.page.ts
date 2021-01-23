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
        console.log(paramMap.get('available'))
        this.avaible_room = JSON.parse(paramMap.get('available'))
        this.filterAvailability()
        console.log('available', this.avaible_room[0][0])
        this.room_id =  paramMap.get('room_id');
        this.date = this.updateDate(this.avaible_room[0][0]);
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
      this.router.navigate(['/library/available-rooms/reserve-finish', { name: this.room_name, room_id: this.room_id, available: this.avaible_room[0][0], start: this.start_time, end: this.finish_time}]);
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
    const available = avaible_room;
    console.log("avail_room",available)
    const start = new Date(start_time);
    available.filter(x => new Date(x[0]).getTime() >= start.getTime());
    const end = new Date(finish_time);


    if (date_reservation === undefined || start_time === undefined || finish_time === undefined){
      this.presentAlert('Todos os campos devem ser preenchidos.');
      return false;
    }
    else {
      if (start.getHours() > end.getHours()) {
        this.presentAlert('Sua horário final é inferior ao horário de inicio escolhido');
        return false;
      }
      else {
        if (start.getTime() <= new Date(available[0][0]).getTime()) {
          this.presentAlert("A data escolhida é anterior à disponibilidade da sala.");
          return false;
        }
        else {
          if(
            start.getTime() >= new Date(available[0][0]).getTime() 
            && start.getTime() <= new Date(available[0][1]).getTime() 
            && end.getTime() <= new Date(available[0][1]).getTime()
            ){
            console.log(available)
            return true;
          }
          else {
            if(available.length > 1) this.presentAlert(`A sala só estará disponível dia ${new Date(available[1][0]).getDate()}/${String(new Date(available[1][0]).getMonth() + 1).padStart(2, "0")} a partir das ${new Date(available[1][0]).getHours()}:${String(new Date(available[1][0]).getMinutes()).padStart(2, "0")}h`);
            else this.presentAlert("Não existem mais slots disponíveis hoje para esta sala");
            return false;
          }
        }
      }
    }

  }

  filterAvailability(){
    this.avaible_room.filter(x => new Date(x[0]).getTime() >= new Date().getTime());
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

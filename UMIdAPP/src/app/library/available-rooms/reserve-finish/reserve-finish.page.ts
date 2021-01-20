import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
//essa biblioteca ajuda a trabalhar com datas e time 
import * as moment from 'moment';

@Component({
  selector: 'app-reserve-finish',
  templateUrl: './reserve-finish.page.html',
  styleUrls: ['./reserve-finish.page.scss'],
})
export class ReserveFinishPage implements OnInit {
  room_name: string;
  date: any;

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
  start: string;
  end: string;

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    public alertController: AlertController) { }

  ngOnInit() {

    this.activateRoute.paramMap.subscribe(
      (paramMap) => {
        this.room_name = "Sala " + paramMap.get('name');
        this.date = this.updateDate(paramMap.get('available'));
        this.start = paramMap.get('start');
        this.end = paramMap.get('end');
      }
    );

    

    this.view_name = 'Reservar';
    this.has_back_button = true;
    this.show_counter = true;
    this.quantity = 2; 
    this.card_type = "slots_reservas"; 
    this.prod_name = "slots";
    this.operation_name = "adicionados";

    const startTime = new Date(this.start);
    const endTime = new Date(this.end);
    const totalSlots = this.getNumberSlot(startTime,endTime,30);

    let begin = startTime
    let end = moment(startTime).add(30, 'm').toDate()

    for (let index = 0; index < totalSlots-1; index++) {
      if (index == 0){
        this.items.push({start:`${begin.getHours()}:${begin.getMinutes()}h`, end:`${end.getHours()}:${end.getMinutes()}h`})
      }
      begin = end;
      end = moment(begin).add(30, 'm').toDate();
      this.items.push({start:`${begin.getHours()}:${begin.getMinutes()}h`, end:`${end.getHours()}:${end.getMinutes()}h`})
      
    }

    this.dataLoaded = true;

  }

  /**
   * Devolve quantos slotes é possível para aquela sala definindo o tamanho de
   * tempo de cada slot
   *
   * @param {*} startTime
   * @param {*} endTime
   * @param {*} timeSlot
   * @return {*} 
   * @memberof ReserveFinishPage
   */
  getNumberSlot(startTime,endTime,timeSlot){
    let hour = endTime.getHours() - startTime.getHours();
    let min = endTime.getMinutes() - startTime.getMinutes();
    return ((hour*60)+min)/timeSlot;
  }

  goBack(_event) {
    this.router.navigate(['/library/available-rooms/reserve', { userType: 'STUDENT' }]);
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

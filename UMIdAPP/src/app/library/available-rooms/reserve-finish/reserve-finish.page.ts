import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
//essa biblioteca ajuda a trabalhar com datas e time 
import * as moment from 'moment';
import { LibraryService } from '../../../../services/library.service'
import * as SecureStorage from '../../../../common/general/secureStorage.js';
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
  room_id: number;

  // adicionar botao voltar para trás true -> sim, false -> nao (depende da vista)
  has_back_button: boolean;

  // lista com items do que queremos colocar na view (designação, datas, horários, etc.)
  items: Object[] = [];
  operation_name: string;
  prod_name: string;
  card_type: string;
  quantity: number = 0;
  show_counter: boolean;
  dataLoaded: boolean = false;
  reservationDone: boolean = false;
  start: string;
  end: string;
  currentDate: Date;
  success_quote: string;
  icon_name: string;
  success: boolean;
  failure_quote: string;
  failure: boolean;

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private libService: LibraryService,
    public alertController: AlertController
    ) { }

  ngOnInit() {

    this.activateRoute.paramMap.subscribe(
      (paramMap) => {
        this.room_name = paramMap.get('name');
        this.room_id = JSON.parse(paramMap.get('room_id'));
        console.log(this.room_id);
        this.date = this.updateDate(paramMap.get('available'));
        this.start = paramMap.get('start');
        this.end = paramMap.get('end');
      }
    );

    this.view_name = 'Reservar';
    this.has_back_button = true;
    this.show_counter = true;
    this.card_type = "slots_reservas"; 
    this.prod_name = "slots";
    this.operation_name = "adicionados";
    const startTime = new Date(this.start);
    this.currentDate = startTime;
    const endTime = new Date(this.end);
    const totalSlots = this.getNumberSlot(startTime,endTime,30);

    let begin = startTime
    let end = moment(startTime).add(30, 'm').toDate()

    for (let index = 0; index < totalSlots-1; index++) {
      if (index == 0){
        this.items.push({start:`${String(begin.getHours()).padStart(2, "0")}:${String(begin.getMinutes()).padStart(2, "0")}h`, end:`${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}h`, added: false})
      }
      begin = end;
      end = moment(begin).add(30, 'm').toDate();
      this.items.push({start:`${String(begin.getHours()).padStart(2, "0")}:${String(begin.getMinutes()).padStart(2, "0")}h`, end:`${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}h`, added: false})    
    }

    this.dataLoaded = true;

  }

  addSlots(event){
    this.quantity +=1;
  }

  removeSlots(event){
    this.quantity -=1;
  }

  confirmReservation(event){
    const ss = SecureStorage.instantiateSecureStorage();
    SecureStorage.get('dataAuth', ss).then(
      dataUser=> {
        const data = JSON.parse(dataUser);
        const consecutiveDates = this.checkConsecutiveDates(this.items.filter(x => { return x['added'] == true }));
        console.log(consecutiveDates)
        if(consecutiveDates){
          const beginTimeList = consecutiveDates.begin_time.split(':');
          const beginDate = this.currentDate;
          beginDate.setHours(beginTimeList[0]);
          beginDate.setMinutes(beginTimeList[1])
          const beginTime = beginDate.toISOString();
          const endTimeList = consecutiveDates.end_time.split(':');
          const endDate = this.currentDate;
          beginDate.setHours(endTimeList[0]);
          beginDate.setMinutes(endTimeList[1]);
          const endTime = endDate.toISOString();
          const payload = {
            start: beginTime, 
            end: endTime, 
            user: data.username,
            room: this.room_id
          }
          console.log(payload);
          this.libService.makeReservation(
            data.username,
            data.password,
            payload
          ).then(
            (response) => {
              this.reservationDone = true;
              this.show_counter = false;
              if(response.status == 200) {
                console.log("A sua reserva foi bem sucedida!");
                this.success_quote = 'A sua reserva foi efetuada com sucesso';
                this.success = true;
                this.icon_name='library';
              }
            },
            (error) => {
              console.log(error)
              this.show_counter = false;
              this.reservationDone = true;
              if(error.status == 500) {
                this.failure_quote = 'Erro na conexão ao servidor';
                this.failure = true;
                this.icon_name='library';
                console.log("Erro na conexão ao servidor");
              }
              else {
                this.failure_quote = 'Erro no processo de reserva';
                this.failure = true;
                this.icon_name='library';
              }
            }
          )
        }

      }
    );
  }

  checkConsecutiveDates(items){
    let consecutive = true
    let beginTime = items[0].start;
    for(let i = 1; i<items.length && consecutive; i++){
      if(items[i-1].end != items[i].begin){
        consecutive = false
      }
    }
    let endTime = items[items.length-1].end;
    return { consecutive: consecutive, begin_time: beginTime.slice(0, -1), end_time: endTime.slice(0, -1) };
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

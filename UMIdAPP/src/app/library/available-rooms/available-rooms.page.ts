import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { LibraryService } from '../../../services/library.service';
import * as SecureStorage from '../../../common/general/secureStorage.js';
import { Network } from '@ionic-native/network/ngx';


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

  teste;


  constructor(private activateRoute: ActivatedRoute,
    public navCtrl: NavController,
    private router: Router,
    private network: Network,
    private libraryService: LibraryService,
    public alertController: AlertController) {}

  ngOnInit() {

    this.items = [];
    // salas disponiveis
    this.view_name = "Salas disponíveis";
    this.has_back_button = true;
    this.show_counter = false;
    this.card_type = "salas_disponiveis";
    
    const ss = SecureStorage.instantiateSecureStorage();
    SecureStorage.get('dataAuth', ss).then(dataUser => {
      const user = JSON.parse(dataUser);
      console.log(user.username);
      

      this.libraryService.getFreeRoom(user.username, user.password).then(async (rooms) => {
        if (rooms.status === 200) {
          console.log('status code', 200)
          const roomsJSON = JSON.parse(rooms.data);
          console.log("That's right", roomsJSON);
          console.log("That's 1", roomsJSON[0]);

          for await (const element of roomsJSON) {
            let available = await this.availableRoom(user.username, user.password, element['id']);
            console.log('Available', available,' id',element['id'] );
            this.items.push({ name: "reserva", icon_name: 'calendario', room_name: "Sala " + element['number'], date: available.toISOString(), capacity: "Capacidade: " + element['capacity'], url: '/library/available-rooms/reserve', args: { id: element['id'], number_room:element['number'], available: available.toISOString()} });
          } 
            this.dataLoaded = true;
        }

      },
        (err) => {
          console.error('There was an error!', err);
          if (!this.isConnected()) {
            this.presentAlert();
          }
          if (err.status == 400) {
            console.log('Dados Inválidos.');

          };

          if (err.status == 500) {
            console.log('Erro na conexão com o servidor, tente novamente.');

          }
        });
    })


  }

  async availableRoom(username, password, id) {
    const freeTime = await this.libraryService.getFreeTime(username, password, id).then(result => { return result.data });
    // console.log("Sala ",id, 'é', freeTime)
    let freeTimeAvailable = JSON.parse(freeTime)[0][0]
    // console.log("Sala horario ",freeTimeAvailable);
    var available = new Date(freeTimeAvailable); 
    return available

  }

  /**
   * Verifica se há conexão com a internet para efetuar associação.
   * @return {*}  {boolean} retorna se há (true) ou não (false)
   * @memberof LoginPage
   */
  isConnected(): boolean {
    const conntype = this.network.type;
    return conntype && conntype != 'unknown' && conntype != 'none';
  }

  nextPage(_event) {
    console.log(_event);
    const ev = JSON.parse(_event);
    console.log(ev)
    if (ev.args) {
      this.navCtrl.navigateRoot([ev.url, ev.args]);
    }
    else this.navCtrl.navigateRoot([ev.url]);
  }

  goBack(_event) {
    this.router.navigate(['/home', { user_info: 1 }]);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Aviso',
      subHeader: 'Erro de conexão',
      message: 'Para essa funcionalidade precisas de internet, ligue wifi ou os dados moveis.',
      buttons: ['OK']
    });

    await alert.present();
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as SecureStorage from '../../../common/general/secureStorage.js';
import { LibraryService } from '../../../services/library.service';
import { Network } from '@ionic-native/network/ngx';
import { AlertController } from '@ionic/angular';

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

  reservationsJSON;

  show_counter: boolean;

  card_type: string; 

  dataLoaded: boolean = false;
  
  constructor(
    private router: Router, 
    private libraryService: LibraryService,
    private network: Network,
    public alertController: AlertController) { }

  async ngOnInit() {

    if (!this.isConnected()) {
      this.presentAlert();
    }

    // próximas reservas
    this.view_name = "Próximas reservas";
    this.has_back_button = true;
    this.show_counter = false;
    this.card_type = "proximas_reservas";
    // Busca as reservas do utilizador no Secure Storage
    const ss = SecureStorage.instantiateSecureStorage();
    this.reservationsJSON = await SecureStorage.get('reservations',ss).then(reservations=>{
      return JSON.parse(reservations); 
    });

    // Busca as credenciais do utilizador no Secure Storage
    let dataAuth = await SecureStorage.get('dataAuth', ss).then(dataUser => {
      return JSON.parse(dataUser);
    });


    // Fará a geração dos cartões utilizando as reservas armazenadas do utilizador
    for await (const element of this.reservationsJSON) { 
      let begin_date = new Date(element['start'])
      let end_date = new Date(element['end']); 

      // busca o número da sala da próxima reserva, pois o que utilizador tem o id da sala armazenada no telemovel
      const room = await this.libraryService.getOneRoom(dataAuth['username'],dataAuth['password'],element['room']).then(result=>{
        return JSON.parse(result.data);
      })

      console.log('Room data', room['number']);
      this.items.push({name: "reserva", icon_name: 'calendario', room_name: "Sala "+room['number'], begin_date: begin_date.toISOString() , end_date: end_date.toISOString(), check_in: false})  
    };

    this.dataLoaded = true;
  }

  ngOnDestroy () { }


  goBack(_event){
    this.router.navigate(['/library',{ userType: 'STUDENT'}]);
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

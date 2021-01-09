import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController} from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
})
export class LibraryPage implements OnInit {
  // nome da página (Cantina, Biblioteca, etc.)
  view_name: string;

  // adicionar botao voltar para trás true -> sim, false -> nao (depende da vista)
  has_back_button: boolean;
  
  // lista com items do que queremos colocar na view (designação, datas, horários, etc.)
  items: Object[] = [];

  show_counter: boolean;

  card_type: string;

  dataLoaded: boolean = false;

  segment: string;

  constructor(
    private activateRoute: ActivatedRoute,
    public navCtrl: NavController,
    private router: Router
    ) { }

  ngOnInit() {
    this.activateRoute.paramMap.subscribe(
      (paramMap) => {
        if (!paramMap.has('userType')) {
          return;
        }
        else {
          this.view_name = 'Reserva salas';
          this.items = [];
          const userType = paramMap.get('userType');
          switch (userType) {
            case 'STUDENT':
              // Menu inicial estudante 
                this.has_back_button = true;
                this.show_counter = false;
                this.card_type = "main menu";
                this.items.push({name: "Consultar salas disponíveis", icon_name: 'salas disponiveis', url:'/library/available-rooms'});
                this.items.push({name: "Consultar próximas reservas", icon_name: 'proximas reservas'});
                this.items.push({name: "Check-in", icon_name: 'check-in'});
                this.items.push({name: "Check-out", icon_name: 'check-out'});
                this.dataLoaded = true;
              break;
            default: break;
          }
          console.log(this.items);
        }
      }
    );
  }

  nextPage(_event){
    console.log(_event);
    const ev = JSON.parse(_event);
    console.log(ev)
    if(ev.args){
      this.navCtrl.navigateRoot([ev.url, ev.args]);
    }
    else this.navCtrl.navigateRoot([ev.url]);
  }

  goBack(_event){
    this.router.navigate(['/home',{ user_info: 1}]);
  }

}

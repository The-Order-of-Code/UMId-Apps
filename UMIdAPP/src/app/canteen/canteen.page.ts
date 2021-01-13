import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController, NavController} from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-canteen',
  templateUrl: './canteen.page.html',
  styleUrls: ['./canteen.page.scss'],
})
export class CanteenPage implements OnInit {
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

  ticket: any;

  constructor(
    private activateRoute: ActivatedRoute,
    public navCtrl: NavController,
    private router: Router,
    private menu: MenuController,
    ) { }

  ngOnInit() {
    this.activateRoute.paramMap.subscribe(
      (paramMap) => {
        if (!paramMap.has('userType')) {
          return;
        }
        else {
          this.view_name = 'Cantina';
          this.items = [];
          const userType = paramMap.get('userType');
          switch (userType) {
            case 'STUDENT':
              // Menu inicial estudante 
                this.has_back_button = true;
                this.show_counter = false;
                this.card_type = "main menu";
                this.items.push({name: "Apresentar senha", icon_name: 'senha', url: '/canteen/choice-ticket'});
                this.items.push({name: "Permissão", icon_name: 'perfil', url: '/authorization'});
                this.items.push({name: "Consultar senhas", icon_name: 'pesquisar senhas', url:'/canteen/search-ticket'});
                this.items.push({name: "Comprar senhas", icon_name: 'comprar senhas', url:'/canteen/buy-ticket'});
                this.dataLoaded = true;
              break; 
            case 'EMPLOYEE':
              // Menu inicial funcionário cantina
              this.has_back_button = true;
              this.show_counter = false;
              this.card_type = "main menu";
              this.items.push({name: "Verificar senha", icon_name: 'verificar senha'});
              this.items.push({name: "Verificar identificação", icon_name: 'verificar identidade'});
              this.items.push({name: "Apresentar senha", icon_name: 'senha'});
              this.items.push({name: "Consultar senhas", icon_name: 'pesquisar senhas'});
              this.items.push({name: "Comprar senhas", icon_name: 'comprar senhas'});
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

  openMenu(): void {
    this.menu.open();
  }

}

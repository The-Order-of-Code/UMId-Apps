import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-card-page',
  templateUrl: './card-page.page.html',
  styleUrls: ['./card-page.page.scss'],
})
export class CardPagePage implements OnInit {
  card_info: Object;

  // nome da página (Cantina, Biblioteca, etc.)
  view_name: string;
  
  // adicionar botao voltar para trás true -> sim, false -> nao (depende da vista)
  has_back_button: boolean;

  show_counter: boolean;
  
  segment: string;
  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.view_name = "Ver Cartão";
    this.has_back_button = true;
    this.show_counter = false;
    this.segment = 'profile';
    this.activateRoute.paramMap.subscribe(
      (paramMap) => {
        console.log(paramMap);
        if (!paramMap.has('user')) {
          return;
        }
        else {
          const c = paramMap.get('user');
          this.card_info = JSON.parse(c);
          console.log(this.card_info);
          //this.first_name = this.card_info.user.first_name;
        }
      });
  }

  goBack(_event) {
    console.log(_event);
    this.router.navigate(['/home',{ user_info: 1}]);
  }

}

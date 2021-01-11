import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-show-ticket',
  templateUrl: './show-ticket.page.html',
  styleUrls: ['./show-ticket.page.scss'],
})
export class ShowTicketPage implements OnInit {

  // nome da página (Cantina, Biblioteca, etc.)
  view_name: string;

  // adicionar botao voltar para trás true -> sim, false -> nao (depende da vista)
  has_back_button: boolean;

  show_counter: boolean;

  createdCode: string;
  data_name: string;
  dataLoaded: boolean = false;
  router: any;
  
  constructor(private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activateRoute.paramMap.subscribe(
      (paramMap) => {
        if (!paramMap.has('user') || !paramMap.has('data_name')) {
          console.log('here');
          return;
        }
        else {
          this.view_name = "Apresentar " + paramMap.get('data_name');
          this.has_back_button = true;
          this.show_counter = false;
          const user_info = 'senha para o prato principal'//paramMap.get('user');
          console.log(user_info);
          this.createdCode = user_info;
          this.data_name = paramMap.get('data_name');
          console.log(this.data_name);
          this.dataLoaded = true;
        }
      }
    );
  }
  
  goBack(_event) {
    this.router.navigate(['/home', { user_info: 1 }]);
  }

}

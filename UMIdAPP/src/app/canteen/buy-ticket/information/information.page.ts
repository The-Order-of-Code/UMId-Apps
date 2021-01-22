import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-information',
  templateUrl: './information.page.html',
  styleUrls: ['./information.page.scss'],
})
export class InformationPage implements OnInit {
    // nome da vista 
    view_name: string;

    // lista com items osd quais iräo na view (nesse caso o tipo de senha e sua quantidade)
    items: Object[] = [];
   
  
    show_counter: boolean;
  
    dataLoaded: boolean = false;
  
    segment: string;
    // adicionar botao voltar para trás true -> sim, false -> nao (depende da vista)
    has_back_button: boolean;

  constructor(private router: Router,private storage: Storage) { }

  ngOnInit() {
    this.view_name = "Senha do dia";
    this.has_back_button = true;
    this.show_counter = false;
    this.dataLoaded = true;
    this.storage.get('tickets_simples').then(result=>{
      console.log('senha simples',result);
    })
    this.storage.get('tickets_complete').then(result=>{
      console.log('senha completa',result);
    })


  }

  goForward(_event) {
    this.router.navigate(['/canteen/buy-ticket/buy-ticket-day']);
  }

  goBack(_event){
    this.router.navigate(['/canteen/buy-ticket',{ userType: "STUDENT"}]);
  }

  

  

}

import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // nome da página (Cantina, Biblioteca, etc.)
  view_name: string;

  // primeiro nome do aluno 
  first_name: string;

  // adicionar botao voltar para trás true -> sim, false -> nao (depende da vista)
  has_back_button: boolean;
  
  // lista com items do que queremos colocar na view (designação, datas, horários, etc.)
  items: Object[] = [];

  show_counter: boolean;

  prod_name: string;

  quantity: number;
  
  operation_name: string;

  card_type: string; 
  /*PAGAMENTO */
  text_pay :string;
  total_value:any;
  title_description:any;
  title_count:any;
  title_value:any;
  text_select:any;
  show_pay:any;
  description:any;

  /** sucesso */
  success_quote:any;
  icon_name:any;

  /** qrcode */
  title:any;
  createdCode:any;
  elementType:any;

  profile:string;

  message:string;
 

  failure_quote:any;

  constructor(private menu: MenuController,) {
    this.menu.enable(true)
    /**
     * só um pequeno exemplo para testar
     */
    this.view_name = "Apresentar senha";
    this.first_name = "Joana";
    this.has_back_button = true;
    this.show_counter = false;
     

    //this.quantity = 2;
    this.card_type = "payments";
    this.prod_name = "slots";
    this.operation_name = "adicionados";

    
   
    this.show_pay = false;
     //this.text_pay = 'Valor em pagamento:' 
     this.total_value = 95 + '€';
     this.title_description = 'Descrição:';
     this.title_count = 'Quantidade:';
     this.title_value = 'Valor:';
     this.description='senha';
     this.items.push("16:00h - 16:30h")
     this.items.push("16:00h - 16:30h")
     this.items.push("16:00h - 16:30h")
     this.text_select= "Seleciona a forma de apagamento:"
     this.success_quote  = 'sucesso ao compartilhar';
     this.icon_name='ticket';
     this.createdCode = 'Todos estão aqui fdsafjdsakfjk';
     this.title = "Utilize o código QR Code\n para  realizar o check-in.";
     this.elementType = 'url';
     this.profile = 'Estudante'
     this.message = "A enviar senha."
     this.failure_quote = "Não foi possível debitar a senha."


     
     this.items.push({value: 87.15+" €", n_propinas: "3° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/12/2020"})
     this.items.push({value: 87.15+" €", n_propinas: "3° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/01/2021"})
     this.items.push({value: 87.15+" €", n_propinas: "3° PRESTAÇÃO DE PROPINAS", ano: "(2020/2021) - (PÓS-GRADUAÇÃO)", valid: "Até 10/02/2021"})

     /*this.items.push({count:8, type_ticket:"Senha do dia",descripton:"Dá-te direito ao prato principal, sopa, uma bebida e sobremesa.",date:"24/02/2020"})*/
     

     //this.items.push({name:"Cantina",icon_name:"ticket"})


    


   

  }
  
 
  goBack(_event) {
    console.log(_event);
  }

  openMenu(): void {
    this.menu.open();
  }


}

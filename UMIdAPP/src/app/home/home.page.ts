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

  info: string;
  sub_info: string;
  text: string;

  constructor(private menu: MenuController,) {
    this.menu.enable(true)
    /**
     * só um pequeno exemplo para testar
     */
    // this.view_name = "Comprar senhas";
    // this.first_name = "Joana";
    // this.has_back_button = true;


    // cartão simples para cada sala (view da procura)
    // this.has_back_button = true;
    // this.card_type = "room_reservation";
    // this.show_counter = false;
    // this.quantity = 2;
    // let available_begin_date = new Date();
    // available_begin_date.setDate(available_begin_date.getDate());
    // console.log(available_begin_date.toISOString())
    // this.items.push({name: "reserva", icon_name: 'calendario', room_name: "Sala 4", date: available_begin_date.toISOString() })

    // check-out  
    // this.view_name = "Check-out";
    // this.has_back_button = true;
    // this.show_counter = false;
    // this.card_type = "check_out";
    // let begin_date = new Date();
    // begin_date.setHours(19);
    // begin_date.setMinutes(16);
    // console.log(begin_date.toISOString())
    // let end_date = new Date()
    // end_date.setHours(20);
    // end_date.setMinutes(20);
    // this.items.push({name: "reserva", icon_name: 'calendario', room_name: "Sala 4", begin_date: begin_date.toISOString() , end_date: end_date.toISOString(), check_in: true})


    // check-in  
    // this.view_name = "Check-in";
    // this.has_back_button = true;
    // this.show_counter = false;
    // this.card_type = "check_in";
    // let begin_date = new Date();
    // begin_date.setHours(19);
    // begin_date.setMinutes(16);
    // console.log(begin_date.toISOString())
    // let end_date = new Date()
    // end_date.setHours(20);
    // end_date.setMinutes(20);
    // this.items.push({name: "reserva", icon_name: 'calendario', room_name: "Sala 4", begin_date: begin_date.toISOString() , end_date: end_date.toISOString(), check_in: false})


    // próximas reservas
    // this.view_name = "Próximas reservas";
    // this.has_back_button = true;
    // this.show_counter = false;
    // this.card_type = "proximas_reservas";
    // let begin_date = new Date();
    // begin_date.setHours(19);
    // begin_date.setMinutes(16);
    // console.log(begin_date.toISOString())
    // let end_date = new Date()
    // end_date.setHours(20);
    // end_date.setMinutes(20);
    // this.items.push({name: "reserva", icon_name: 'calendario', room_name: "Sala 4", begin_date: begin_date.toISOString() , end_date: end_date.toISOString(), check_in: false})
    
    
    // salas disponiveis
    // this.view_name = "Salas disponíveis";
    // this.has_back_button = true;
    // this.show_counter = false;
    // this.card_type = "salas_disponiveis";
    // let available_begin_date = new Date();
    // available_begin_date.setDate(available_begin_date.getDate());
    // console.log(available_begin_date.toISOString())
    // this.items.push({name: "reserva", icon_name: 'calendario', room_name: "Sala 4", date: available_begin_date.toISOString() })
    // available_begin_date.setDate(available_begin_date.getDate() + 1)
    // this.items.push({name: "reserva", icon_name: 'calendario', room_name: "Sala 2", date: available_begin_date.toISOString() })
    // available_begin_date.setDate(available_begin_date.getDate() + 2)
    // this.items.push({name: "reserva", icon_name: 'calendario', room_name: "Sala 3", date: available_begin_date.toISOString() })
    

    // Senhas promocionais 
    // this.view_name = "Senha do dia";
    // this.has_back_button = true;
    // this.show_counter = true;
    // this.quantity = 2;
    // this.card_type = "senhas";
    // this.prod_name = "senhas";
    // this.operation_name = "adicionadas";
    // this.items.push("19/01/2020")
    // this.items.push("19/01/2020")
    // this.items.push("19/01/2020")
    // this.items.push("19/01/2020")
    // this.items.push("19/01/2020")
    // this.items.push("19/01/2020")


    // Reservas
    // this.view_name = "Reservar";
    // this.has_back_button = true;
    // this.show_counter = true;
    // this.quantity = 2;
    // this.card_type = "slots_reservas";
    // this.prod_name = "slots";
    // this.operation_name = "adicionados";
    // this.items.push("14:30h - 15:00h")
    // this.items.push("15:00h - 15:30h")
    // this.items.push("15:30h - 16:00h")
    // this.items.push("16:00h - 16:30h")
    // this.items.push("16:30h - 17:00h")
    // this.items.push("17:00h - 17:30h")
    // this.items.push("17:30h - 18:00h")


    // Menu inicial estudante
    // this.first_name = "Joana";
    // this.has_back_button = false;
    // this.show_counter = false;
    // this.card_type = "main menu";
    // this.items.push({name: "Cantina", icon_name: 'cantina'});
    // this.items.push({name: "Reserva de salas de estudo", icon_name: 'biblioteca'});
    // this.items.push({name: "Apresentar identificação", icon_name: 'cartao'});
    // this.items.push({name: "Pagamentos", icon_name: 'carteira'});
    // this.items.push({name: "Ver cartão", icon_name: 'perfil'});


    // Menu inicial funcionário cantina
    // this.first_name = "Joana";
    // this.has_back_button = false;
    // this.show_counter = false;
    // this.card_type = "main menu";
    // this.items.push({name: "Verificar senha", icon_name: 'verificar senha'});
    // this.items.push({name: "Verificar identificação", icon_name: 'verificar identidade'});
    // this.items.push({name: "Cantina", icon_name: 'cantina'});
    // this.items.push({name: "Apresentar identificação", icon_name: 'cartao'});
    // this.items.push({name: "Ver cartão", icon_name: 'perfil'});


    // Menu inicial funcionário biblioteca
    // this.first_name = "Joana";
    // this.has_back_button = false;
    // this.show_counter = false;
    // this.card_type = "main menu";
    // this.items.push({name: "Verificar reserva", icon_name: 'verificar reserva'});
    // this.items.push({name: "Verificar identificação", icon_name: 'verificar identidade'});
    // this.items.push({name: "Cantina", icon_name: 'cantina'});
    // this.items.push({name: "Reserva de salas de estudo", icon_name: 'biblioteca'});
    // this.items.push({name: "Apresentar identificação", icon_name: 'cartao'});
    // this.items.push({name: "Ver cartão", icon_name: 'perfil'});


    // Menu inicial professor
    // this.first_name = "Joana";
    // this.has_back_button = false;
    // this.show_counter = false;
    // this.card_type = "main menu";
    // this.items.push({name: "Verificar identificação", icon_name: 'verificar identidade'});
    // this.items.push({name: "Cantina", icon_name: 'cantina'});
    // this.items.push({name: "Reserva de salas de estudo", icon_name: 'biblioteca'});
    // this.items.push({name: "Apresentar identificação", icon_name: 'cartao'});
    // this.items.push({name: "Ver Cartão", icon_name: 'perfil'});


    // A view do Loading
    // this.icon_name = "restaurant"
    // this.message = "A debitar senha."

    //A view de pagamentos
    // this.text_pay = "Valor em pagamento:"
    // this.total_value= 92.65+"€"
    // this.title_description= "Descrição:"
    // this.title_count=" Quantidade:"
    // this.title_value="Valor:"

    // this.items.push({description:"Senha normal",count:1,value:2.50+"€"})
    // this.items.push({description:"Senha do dia",count:2,value:2.00+"€"})
    // this.items.push({description:"3° prestação de propinas ",count:1,value:87.15+"€"})
    //  // rodape da pagina
    // this.show_pay = true;
    // this.text_select = "Selecione o meio de pagamento:"

    // A view do qrcode
    // this.title = "Utilize o código QR Code para  debitar uma senha para sua refeição."
    // this.createdCode = "Equipa The order of code."
    
    // A view de sucesso
    // this.icon_name = "ticket"
    // this.success_quote = "Senha debitada com sucesso."

    // A view de insucesso
    //  this.icon_name = "ticket"
    //  this.failure_quote = "Não foi possível debitar a senha ."

    // A view de permissão
    // this.info = "Deseja compartilhar uma senha com Leonardo ?"
    // this.icon_name="ticket"
    // this.sub_info = "Senha completa."

    // A view do menu Cantina
    // this.card_type= "cantina menu"
    // this.items.push({title:"Apresentar senha",icon_name:"ticket"})
    // this.items.push({title:"Consultar senha",icon_name:"ticket",sub_icon_name:"search"})
    // this.items.push({title:"Comprar senha",icon_name:"ticket",sub_icon_name:"wallet"})

    // A view da notificação
    // this.view_name = "Notificações";
    // this.items.push({icon_name:"restaurant",descripton:"Amanhã deve-se utilizar sua senha do dia, para não perdê-la.", type:"Urgente"})
    // this.items.push({icon_name:"wallet",descripton:"Pagamento da sua propina referente ao mês de janeiro vence daqui a 10 dias.", type:"Atenção"})
    // this.items.push({icon_name:"library",descripton:"Sua reserva da sala 2 campus Gualtar as 14 horas iniciará dentre 10 mins.", type:"Urgente"})
    // this.items.push({icon_name:"restaurant",descripton:"Foi atualizado seu número de senhas da cantina.", type:"Informativo"})
    // this.card_type='notify'




    // A view para informações
    //this.text = "Para reduzir o desperdício alimentar, a Universidade do Minho oferece um novo tipo de senhas, as senhas do dia.\n As senhas do dia podem ser senhas simples ou completas. Fica à tua escolha.  Nota que tens de consumir a senha no dia que escolheste para a refeição. Caso não tenhas consumido no dia, a senha deixa de estar disponível para ser consumida.  "
    

    // A view para proprinas 
    // this.card_type = "paid";
    // this.items.push({value:87.15,n_propinas:"3° PRESTAÇÃO DE PROPINAS",ano:"(2020/2021) - (PÓS-GRADUAÇÃO)",valid:"Até 10/12/2020"});
    // this.items.push({value:87.15,n_propinas:"4° PRESTAÇÃO DE PROPINAS",ano:"(2020/2021) - (PÓS-GRADUAÇÃO)",valid:"Até 10/01/2021"});

    // A view para  consultar senhas 
    //this.card_type="consultar senhas";
    // this.card_type="comprar senhas"; // A view para comprar senhas 
    // this.items.push({count:8,type_ticket:"Senha completa.",descripton:"Dá-te direito ao prato principal, sopa, uma bebida e sobremesa."});
    // this.items.push({count:2,type_ticket:"Senha prato principal.",descripton:"Dá-te direito ao prato principal e uma bebida."});
    // this.items.push({count:2,type_ticket:"Senha do dia.",descripton:"Dá-te direito ao prato principal, sopa, uma bebida e sobremesa.",date:"24-01-2020",selected:"1 senhas adicionadas"});

    

    

    

  }
  
 
  goBack(_event) {
    console.log(_event);
  }

  openMenu(): void {
    this.menu.open();
  }


}

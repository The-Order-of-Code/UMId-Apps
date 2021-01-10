import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController, NavController} from '@ionic/angular';
import * as SecureStorage from '../../common/general/secureStorage.js';

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

  card_info: Object;

  dataLoaded: boolean = false;

  segment: string;

  constructor(
    private activateRoute: ActivatedRoute,
    public navCtrl: NavController,
    private menu: MenuController,
  ) {
  }
  
  ngOnInit() {
    this.menu.enable(true);
    /**
     * só um pequeno exemplo para testar
     */
    // this.view_name = "Comprar senhas";
    // this.first_name = "Joana";
    // this.has_back_button = true;
  
    // template para a visualização do cartão de identificação.
    // this.view_name = "Ver Cartão";
    // this.has_back_button = true;
    // this.show_counter = false;
    // const portrait = '/9j/4AAQSkZJRgABAQAAAQABAAD/4QBaRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAoKADAAQAAAABAAAAyAAAAAAAAP/bAEMACQYHCAcGCQgHCAoKCQsNFg8NDAwNGxQVEBYgHSIiIB0fHyQoNCwkJjEnHx8tPS0xNTc6OjojKz9EPzhDNDk6N//bAEMBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAKgAhgMBIgACEQEDEQH/xAAcAAAABwEBAAAAAAAAAAAAAAAAAQIDBAUGBwj/xAA3EAACAQMDAQcCBQIFBQAAAAABAgMABBEFEiExBhMiQVFhcRQyB4GRscFCoRUWI1JyQ2KS4fD/xAAZAQADAQEBAAAAAAAAAAAAAAABAgQDAAX/xAAmEQACAgICAgEDBQAAAAAAAAAAAQIRAyESMUFRE4GRoSJhcbHR/9oADAMBAAIRAxEAPwDruKIClUVYmgWKGKOjrgBUMUdCuOBijAoUoUQBAUdCjFccClDpRUoUQBgUMUoUK44ICjAoxR0TgAUKMUK44hmk0ZNNM4FIMLJot1MNLSe9rrCSd1GG96i9770BKK4FEsNSt6gckCoYlxWe7R9rLPR4iJH3SHoicsfj0FdZ1Wat7mGMZkkCj3qDP2g0u3OJbtBXFNY7balqLtskMMZPCp1I+apVuHmbc8rH5JzQ5B4noiy1zTb19lrdRyN6A1YrIh4DAmvNsV5JbyK8Mrq69Cpq20btVqtjfAtcu2TnDng1ykdwPQK0dU/Z/W4NXsluIjhukieamrbIPnToRiqOkZo6IBY5oUS0KJxWSSYqLLOAaEz9agTScmsLNUh5rjk0n6ioJk5oBqVsZInfUUXf8VFBpm9uFtraSdzhUGc1yZ1FX2t7TjSrburfDXMg8Iz9o9a5FqF9JPK8krtJI33MT+1Ttf1CS9u5ppCSzn9B5CqTILHgs3t0pkd0LgZmznp61Mt1MjDbknyp3R9GutVlIQDavXPAHzW30jsnHasrzuZG9+gpMmWMTWGFyM5a6dLMMhAfyNK1ixaIwsq4Krgkj3rokFhEv2rR3mkQ3cRSRMcfdU3z/qN/gSRk+yWsXGl3iyEkxZAdR6V2Kzu1miSVDlGGQR5iuL32m3GlzMAMxk8HyPz6VtPw81j6m3ksJSBJFyAT5VXiyJkmWDR0AN6UoGm0ziliqCaxwGhSRQrjrM/O3Wqyd+TU+5PWqqU+I1MylBA04ppkGlrShHs1n+21x3OhuATl3A/KrzNZD8SLlYtIiBON0uMfAopAObXs26TaOpGTUjS7Ka9nSGMfPHQVUxuZJct1c5+BW27Nz/SJmG1knkYbnKjpTZHxWh8aTezZ6Fp8VlZrFGvQcnHJNXCJnFZ2z7RQpIIbmzuYCeMuvBNaS3kWQAqcq3IqCUXeyyL0P28eW5FTXjATgc4qvl1Oz04g3blM+gzTS9qtLnLCNpTjz7sgUVDQHKwtRs47mFklUYIrJdn5YtP7VRbW2yBu7f0ZTW0luI54O8hYMjDqDXJJL8f5pmkU57uYj4rTAmmzPNTiei4jlc04Kg6PN9RYwS/74wf7VPAr0ls8xqnQYoUYoVwDLXJ61VynxGrC6brVXIfEalZUgA04DTINLBoBHCa5Z+KGod/qUVkjeGEeL/kef2xXS5pRGhYkcVxztPItxrN1cEghpDgU0ewMhaXad7cAkZboB6VsYI7yNxFEREqrxhc7j6VnuyiibVnB5CR5+TmujQwxyqMgZFZ5Z1IoxY7joqbXv306SS8Ybw5AXHJGTg/t+taDspd99CFn6jpVdqEKBdpOAeo9amdnl8bcYXoKxyTT2awhWmx/WZne52RwBiThSx4qrsNYuH79BZoVhJDbV9MeR+avNQ08XYDq5DKc4pVhpkaKQyAsep9a6EopbOcJXoTpqJIjSxAqHGSoPH6eVcd3ldXnO7JNw5P/AJGu8vHHBCxUBcDnj2rg0ETzak7AffIW/vmtMDtsyzLo9Ddh5++0G3y2So21pBXP/wAMr4PBcWm7lSGH8/xXQFq7G7RBkVSFr0oUVCnEMVcyVXu2SafuH5NRWPNRsrQoGjZ9qk02DVfrN+LGzeUnkDj5oBKvtXra2duYYz/rODk/7RXM7hmkdnPyPmpepXr3tyzux8R6nzpsRhbYuRwWx+dOlQtkzsmDDq5z/XEf3rpWlyA5BFcx0q5WPUbeY8BjtPsDxXRdOIWZSCQDU+fsqwOkL1aN3mDA5VRyo61J7P3QXwzQOpB496qr+7kttRdJEBiJyJTyPjFaKwCzWyyi8tACpbazEEVlxbRrZKkd5g7xI0bA4+al2NxHJBmQYcVV3epmBVWNFu2Y7QLc8j3JPlUi0VpIAy+Etz8UtcWOmmDW7xYNLu5s4CRH9Tx/NcsBht5XKfdwFNar8Q78WWmQWgbL3M4B91HJrDXRYFTnzwapxR1ZNmlbNx+H+o/S69bBj4JyYz8n/wCFdpjPlXnLTJ2hVJ1bDwShwfg13/Sbtbu0imU5DqD+dU4n4I8y8lkKFEKFUE5zuVsmmSaU5prdURYGWwKwfb++bvI7YE7V8RHqa20jhQSTXNO1kou9Sdo+dpxXR7OZQIe8kUeZOPin55jKO7j5AbGB8VDP+ju58QGf71baVCqrGzjLOcitJa2LEiXtu8FshfwueQB5Vr+yutfXWarKcXEWFf396zWpxu6uzZPpUvsfCQ8/UHIP9qzmouBrBtSN/HCt0QXwatbaztwwAUn8qotNuDE4WXOK01tdQqV5H61JtFiJkNnFEuQmCep/imby9gsLeSad1jijUlmPQCjnvc5EXibyFUHay2a40O5jbJZ1pe3sV3WjmHarXH17WDdglYUBWBT5DPX5JqYm24iIHLABwPcVTCxkVXGMbG546ZqztQRBJKGAeIgD3q90lSJKd2yRYSqHeI9GXA967J+HeofUaNFEz+OHwEfFcLkkKlJEOBuH5VuOxuvHTbwCQ4SXkr710XTFlG0dyjbK0KrNM1S3vIg8Einjlc8ihVSkiXgzEuajyyqgOT0o7iURoTjJPQVh+0euSRSmBXwx+7HlUdFZYa7ryxo8MDAuRywPSsXLMSzSEdTkZ86S8vfNuY+H9zTohaTxSeHjP/EUy0BlUqbpjv6EZqwspz30QbgBv0pgx73ZgMeQHtRbTnjruA49aa0wJbNGIRdWRIHIbafyqV2dtzDPKCD0FTuz1g76dIXXEu/kE9fX86ttOsNmSyFGJ/qGDUk5dovWOlY59PxvHNWllGhGTHziiggyu1hU+GAoKxsI5DEPQACoes7RaOz42gZ5qzjQ49qzHaSaa9AtrGOSZT1aNSR+tBJsK2ZnQdP/AMVmv4/CpkGFyOpGTWdureS1kaGZSjKenqK6DY9nL2306VoJUNyZUYBDkKV5xn1qB2m0ia6iguYEWSN1DDyK8nI/XNUQm72NkwpwTRiolURkzfbuAq2kgUrui5XlhjqOag6hbSQRNC6MrDDU7oV0VDpLkrtI5rVu0RVTosrLU7qEYEzA4+5DyfkUKjzWDSNn6dyDyDgihQtewcX6NvdyeH2BzXL9XRrvU55iQFLnB9q2uvaj4JLeBsv/ANRgPtHvWK2yXt8sEeQGOAf3NOKlYm3hy4SFTI/ketXn+GvFYyvOpMmOfarSzj0/R5ogMEom5mPJLeQpi+u77UI51tbYwRHrJJwcewpHJ2bqCSKBkjaSBIkAVchvehFbq105ABw4IxVjb2kdvaB5P6SfF74/9ipemaduiVmPLnj34ruWjoRuZrNDiWCcJKFZpYhKi+ROKvp4Z7mATTcGLgKR0Bqkji7rTba7yWa2POOoXzrRqivnvbkGKUBoyDxjqKwaPQtOJDtogXyRU4qOMVFtyvJU5HQVJRqzolap0IlVZcWzPsE33N6KOp/j86fmeew0wsigiQCOMcY54AHtUXdFLKySK2W6H/tHp8n9qetoHu7sSCU/RwnbEWPBP9R/inj1o0jGlb/kct7ORO4glmCGJN7gepqDJpUQ0+NIpujHAz6nP81YotsVu55ZmYnwg0xJDbGCBUkIJNMh7b0/6MxrvZ7Moldd/g27fL86pl7OLCj3NtEVaM52Hoa3WpwTjwxyBl20VqJUsJjLHuU8E4rldgaTVlNaNZXdtGVkMEqjDxuOnxQqddWdncwRsV7uQdSOM0K6rHjGbXn7GS7SQK9k0i+Eh1LbeARnnNZaztp01APCF3sTgnoAfOtZqcu+NogQMqWYn+kCslp0zm6d2GQhGPfmqJHl40ajQ7dbQmQp310xHjcZ28f2pjU7i4czJDwWPiepU1wEnljhJDSlcsevNRruLu0kd3CdAoPnmsS2fHVFU9tK6QWm7dI7lz6AeZP6VtLXTIIxbK0vAHTNQdI0bu7M3dy+HkYdTyF9K0CxWolgycjFF6R2KKu9+RFrBEtpcqsnihcnGeoqTp5tolaK4BZ7dlKbTkPG3II/ajhjsheXCE4VxUawkFvdpHt71EDIvrsPl+Rx+tI2kzbHb19fRZysjXDd1GUTqM0Z3FdqDLEVIf6i6tEcRBRGdrfFRJo5JWRYH2sx2AZ/WkadmfG5AkmeS3YNbHvZfBGcfaPapiiOOARSSbUgj2qinz86UI5QSJ2RI4FIz5k1HU2sNqTgu7nqfOnWjTT6QsvaRaaFCEl2p2U2UkttGUK4xRT3Me23iSD0zThuoZNQjEkOMLRBt735fZGvbVTLL3E/AGOtHbi5i0uTo6lsUqSK2mnmaOTb7ZpMUc0WlO0Um4GTpXeGxfSb9DbyQtFGJI9pxnkUKdeYd3GJ4eQvBxQrOUmnSNY8ktX9zmEcNzfmVGzChKq7edWkGhw2ljcRwlXVeNx6t50KFbT7ZJgS4pjOp2AguYfpn2MAC5PPt/NO2emI1+73M3e7U3AYwM0KFBdDZNM0XcQfQH/UJ5/mnGe1X6cgZ9eDQoUJs0gr/JIjNqdQ5XAK+9O21vaPJNsco6ncjA9DQoUL2NJUnvwh20ubiWYJI6pG52uVPBPrSbbR57fULy4efwREGNvXIoUKeMU9szyTcJ8V5/0VO0H0zPNKXd2pUk8KLBFFFzxzihQrNyaN4RUu/wBx9ruRr5NsHCjj+9KhvA1/IZoQQB50KFNyd/UCxx/Ayhs5I5pD4Sc+1E9s6aZCLeTIdyaFCjHaMpScZUvYJruS2CiWMHjjihQoUknsrxYYSgm0f//Z';
    // this.card_info = {
    //   portrait: portrait,
    //   full_name: "Filipa Correia Parente",
    //   birthDate: "05/04/1998",
    //   course: {
    //     designation: "MIEINF - Mestrado Integrado em Engenharia Informática",
    //     teachingResearchUnits: "Escola de Engenharia",
    //     year: 5
    //   },
    //   number: 82145,
    //   user_type: "Estudante"
    // };
  
  
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
    this.activateRoute.paramMap.subscribe(
      (paramMap) => {
        if (!paramMap.has('user_info')) {
          return;
        }
        else {
          this.items = [];
          const user_info = paramMap.get('user_info');
          console.log(user_info);
          const ss = SecureStorage.instantiateSecureStorage();
          SecureStorage.get('user',ss).then((result)=>{
            this.segment='home';
            const user = JSON.parse(result);
            console.log(user);
            switch (user.user.userType) {
              case 'STUDENT':
                // Menu inicial estudante
                  this.first_name = user.user.first_name;
                  this.has_back_button = false;
                  this.show_counter = false;
                  this.card_type = "main menu";
                  this.items.push({name: "Cantina", icon_name: 'cantina', url: '/canteen', args: {userType: user.user.userType}});
                  this.items.push({name: "Reserva de salas de estudo", icon_name: 'biblioteca',url: '/library', args: {userType: user.user.userType}});
                  this.items.push({name: "Apresentar identificação", icon_name: 'cartao', url: '/show-id'});
                  this.items.push({name: "Pagamentos", icon_name: 'carteira', url: '/payments'});
                  this.items.push({name: "Ver cartão", icon_name: 'perfil', url: '/card-page', args: {user: result}});
                  this.dataLoaded = true;
                break;
              case 'EMPLOYEE':
                // Menu inicial funcionário cantina
                this.first_name = user.user.first_name;
                this.has_back_button = false;
                this.show_counter = false;
                this.card_type = "main menu";
                this.items.push({name: "Verificar senha", icon_name: 'verificar senha'});
                this.items.push({name: "Verificar identificação", icon_name: 'verificar identidade'});
                this.items.push({name: "Cantina", icon_name: 'cantina', url: '/canteen', args: {userType: user.user.userType}});
                this.items.push({name: "Apresentar identificação", icon_name: 'cartao'});
                this.items.push({name: "Ver cartão", icon_name: 'perfil'});
                this.dataLoaded = true;
                break;
              default: break;
            }
          })
          console.log(this.items);
        }
      }
    );
  
  
  
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
  

  nextPage(_event){
    console.log(_event);
    const ev = JSON.parse(_event);
    console.log(ev)
    if(ev.args){
      this.navCtrl.navigateRoot([ev.url, ev.args]);
    }
    else this.navCtrl.navigateRoot([ev.url]);
  }

  goBack(_event) {
    console.log(_event);
  }

  openMenu(): void {
    this.menu.open();
  }


}

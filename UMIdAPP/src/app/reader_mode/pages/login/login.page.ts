import { Component, NgZone,OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { Network } from '@ionic-native/network/ngx';
import { NavController, Platform } from '@ionic/angular';
//import * as SecureStorage from '../../../../common/general/secureStorage.js';
 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  message: string;
  fail_flag: boolean;
  indicative: string;
  devWidth: any;

  constructor(
    private changeRef: ChangeDetectorRef,
    private network: Network,
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
    public plt: Platform,
    public navCtrl: NavController
  ) {
   
  }


  ngOnInit() {
    // // check if we already did the association
    // const ss = SecureStorage.instantiateSecureStorage();
    // SecureStorage.get('card', ss).then( 
    //   (card) => {
    //     if (card) {
    //       this.navCtrl.navigateRoot(['/home', { card_info: 1 }]);
    //     }
    //   },
    //   () => {
    //     SecureStorage.clear(ss);
    //   }
    // );
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

  /**
   * Primeira parte da associação
   * se os parâmetros estiverem corretos irá
   * redirecionar para pagina do pin
   * @param {*} form
   * @memberof LoginPage
   */
  login(form): void {
   
    this.authService.login(form.value['number_student'], form.value['password']).then(
      (card_info) => {
        if (card_info.status == 200) {
          this.fail_flag = false;
          console.log(card_info.data)
          //this.router.navigate(['/pin', { url: card_info.data }]);
        }
      },
      (err) => {
        console.error('There was an error!', err);
        if (!this.isConnected()) {
          this.fail_flag = true;
          this.message = 'Verifique a conexão e tente novamente.';
          this.changeRef.detectChanges();
        }
        if (err.status == 400) {
          this.ngZone.run(() => {
            this.fail_flag = true;
            this.message = 'Dados Inválidos.';
            this.changeRef.detectChanges();
          });
        }
        if (err.status == 500) {
          this.ngZone.run(() => {
            this.fail_flag = true;
            this.message = 'Erro na conexão com o servidor, tente novamente.';
            this.changeRef.detectChanges();
          });
        }
      }
    );
  }
}




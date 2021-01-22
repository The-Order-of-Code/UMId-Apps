import { Component, NgZone,OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { Network } from '@ionic-native/network/ngx';
import { NavController, Platform } from '@ionic/angular';
import * as SecureStorage from '../../../../common/general/secureStorage.js';
import { MenuController } from '@ionic/angular';
import { Events } from '../../../../common/general/events';
import * as ComunicationCrypto from '../../../../common/crypto/holder-mode/communicationCrypto.js';
import * as CSR from '../../../../common/crypto/csr.js';
import * as ReaderAuth from '../../../../common/crypto/holder-mode/readerAuth';

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
  is_submitting: boolean;

  constructor(
    private changeRef: ChangeDetectorRef,
    private network: Network,
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
    public plt: Platform,
    public navCtrl: NavController,
    private menu: MenuController,
    private events: Events,
    private net: Network
  ) {
   
  }


  ngOnInit(): void {
    this.menu.enable(false);
    // check if we already did the association
    const ss = SecureStorage.instantiateSecureStorage();
    SecureStorage.get('user', ss).then( 
      (card) => {
        if (card) {
          this.navCtrl.navigateRoot(['/home', { user_info: 1 }]);
        }
      },
      () => {
        SecureStorage.clear(ss);
      }
    );
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
    this.is_submitting = true;
    this.getEntityCertificate({username: form.value['username'], password: form.value['password']}).then(
      (csr) => {
        console.log('csr: ', csr)
        
        const user = [form.value['username'],form.value['password']]
        const dataAuth = {
          username: user[0],
          password: user[1]
        }
          
        this.authService.login(form.value['username'], form.value['password'], csr).then(
          (card_info) => {
            if (card_info.status == 200) {
              this.fail_flag = false;
              let card_info_data = JSON.parse(card_info.data); 
              ReaderAuth.verifyBackendCertChain(card_info_data.userCertificate).then(
                (verified) => {
                  console.log(verified)
                  if(verified) {
                    const ss = SecureStorage.instantiateSecureStorage();
                    Promise.all([
                      SecureStorage.set('user', JSON.stringify(card_info_data.user),ss),
                      SecureStorage.set('mso', JSON.stringify(card_info_data.mso),ss),
                      SecureStorage.set('tickets', JSON.stringify(card_info_data.tickets),ss),
                      SecureStorage.set('reservations', JSON.stringify(card_info_data.reservations),ss),
                      SecureStorage.set('dataAuth', JSON.stringify({username: form.value['username'], password: form.value['password']}),ss),
                      SecureStorage.set('userCertificate', card_info_data.userCertificate,ss)]).then(
                      () => {
                        this.is_submitting = false;
                        this.events.publish('fingerprint_done', {});
                        this.router.navigate(['/home', { user_info: 1 }])
                      }
                    );
                  }
                  else {
                    this.ngZone.run(() => {
                      this.is_submitting = false;
                      this.fail_flag = true;
                      this.message = 'Dados inválidos. Por favor instale a nova versão da aplicação';
                      this.changeRef.detectChanges();
                    });
                  }
                }
              )
            }
          },
          (err) => {
            console.error('There was an error!', err);
            if (!this.isConnected()) {
              this.is_submitting = false;
              this.fail_flag = true;
              this.message = 'Verifique a conexão e tente novamente.';
              this.changeRef.detectChanges();
            }
            if (err.status == 400) {
              this.ngZone.run(() => {
                this.is_submitting = false;
                this.fail_flag = true;
                this.message = 'Dados Inválidos.';
                this.changeRef.detectChanges();
              });
            }
            if (err.status == 500) {
              this.ngZone.run(() => {
                this.is_submitting = false;
                this.fail_flag = true;
                this.message = 'Erro na conexão com o servidor, tente novamente.';
                this.changeRef.detectChanges();
              });
            }
          }
        );
      } 
    )
  }

  /**
   * Método de obtenção do certificado assinado pela entidade 
   */
  async getEntityCertificate(user) {
    return ComunicationCrypto.generate_signing_key().then(
      async (key) => {
        const privKey = await ComunicationCrypto.export_key(key.privateKey)
        const ss = SecureStorage.instantiateSecureStorage();
        SecureStorage.set('privateKey', JSON.stringify(privKey),ss);
        return CSR.make_csr(key, user.username);
    });
  }

}




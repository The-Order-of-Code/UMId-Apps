import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import {
  ToastController,
  AlertController,
  NavController,
} from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { Events } from '../../../../common/general/events';
import { SegmentChangeEventDetail } from '@ionic/core/dist/types/interface';

@Component({
  selector: 'app-pin-auth',
  templateUrl: './pin-auth.page.html',
  styleUrls: ['./pin-auth.page.scss'],
})
export class PinAuthPage implements AfterViewInit, OnInit{
  @ViewChild('input') myInput;
  // pin confirmado
  confirmed: boolean;
  // pin verificado (é igual ao que está guardado em storage)
  verified: boolean;
  // autenticado (já tem os dados da mDL)
  authenticated: boolean;
  // autenticação Touch ID (se está ativada ou não)
  fingerprint: boolean;
  // flag to check mDL is stored
  mdl: number;
  pin: number;
  receivedPin: number;
  fingerBoolean = false;
  pinSize: number;
  nums: number[] = [0, 1, 2, 3, 4, 5];
  infoAutentication: boolean;
  error: boolean;
  alteration: boolean;

  constructor(
    private storage: Storage,
    private router: Router,
    private activateRoute: ActivatedRoute,
    public toastCtrl: ToastController,
    public alertController: AlertController,
    public events: Events,
    public navCtrl: NavController
  ) {}
  
  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('card_info')) {
        this.authenticated = false;
        this.verified = false;
        this.confirmed = false;
        this.infoAutentication = paramMap.has('info');
        this.error = paramMap.has('error');
        this.alteration = paramMap.has('alteration');
        if (paramMap.has('pin')) {
          this.pin = parseInt(paramMap.get('pin'));
        }
        if (paramMap.has('auth')) {
          this.authenticated = JSON.parse(paramMap.get('auth'));
        }
      } else {
        this.storage.get('fingerprint').then((result) => {
          this.confirmed = true;
          this.authenticated = true;
          this.infoAutentication = false;
          this.fingerprint = result;
          if (this.fingerprint) {
            this.authFingerPrint();
          }
        });
      }
    });
  }

  /**
   * Processa o PIN inserido
   */
  processForm(): void {
    const pin = this.receivedPin;
    if (!this.confirmed && !this.verified) {
      if (!this.pin) {
        this.router.navigate([
          '/pin-auth',
          { pin: pin, auth: this.authenticated },
        ]);
      } else {
        if (this.pin == pin) {
          this.storage.set('pin', this.pin);
          this.verified = true;
          if (!this.authenticated) this.checkFingerPrint();
          else {
            this.navCtrl.navigateRoot(['/home', { user_info: 1 }]);
          }
        } else {
          this.router.navigate([
            '/pin-auth',
            { pin: this.pin, auth: this.authenticated, error: true },
          ]);
        }
      }
    }
    if (this.confirmed && this.authenticated) {
      this.storage.get('pin').then(
        (stored_pin) => {
          if (pin != stored_pin) {
            this.toastMessage('Código PIN errado.');
          } else {
            this.events.publish('fingerprint_done', {});
            this.navCtrl.navigateRoot(['/home', { user_info: 1 }]);
          }
        },
        () => {
          this.storage.remove('mdl');
          this.toastMessage('Não procedeu à autenticação completa');
        }
      );
    }
  }

  /**
   * Apresentar mensagem para utilizador
   * gerencia os parametros de conteúdo e tempo de exibição da mesma
   * @param {*} message
   * @memberof PinAuthPage
   */
  toastMessage(message: string): void {
    this.toastCtrl
      .create({
        message: message,
        duration: 8000,
        position: 'top',
      })
      .then((toastr) => {
        toastr.present();
      });
  }

  /**
   * Verifica se o dispositivo tem autenticação biométrica
   * @memberof PinAuthPage
   */
  checkFingerPrint(): void {
    FingerprintAIO.isAvailable()
      .then((result) => {
        this.storage.set('has_biometry', true);
        if (result == 'finger' || result == 'biometric' || result == 'face') {
          this.showBiometricPopUp();
        } else {
          this.infoAutentication = true;
          this.router.navigate([
            '/pin-auth',
            {
              pin: this.pin,
              auth: this.authenticated,
              info: this.infoAutentication,
            },
          ]);
        }
      })
      .catch((err) => {
        if (err.code == FingerprintAIO.BIOMETRIC_NOT_ENROLLED) {
          this.toastMessage(
            'O sensor biométrico não está ativado.\nCaso pretenda essa opção por favor ative nas definições do seu dispositivo.'
          );
        }
        this.storage.set('fingerprint', false);
        this.storage.set('has_biometry', false);
        this.infoAutentication = true;
        this.router.navigate([
          '/pin-auth',
          {
            pin: this.pin,
            auth: this.authenticated,
            info: this.infoAutentication,
          },
        ]);
      });
  }

  /**
   * Apresenta o pop up para o utilizador ativar a autenticação biométrica
   */
  async showBiometricPopUp(): Promise<void> {
    const alert = await this.alertController.create({
      cssClass: 'pop-up-class',
      header: 'Autorização:',
      message: 'Deseja ativar a autenticação biométrica?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.storage.set('fingerprint', false);
            this.infoAutentication = true;
            this.events.publish('fingerprint_done', {});
            this.router.navigate([
              '/pin-auth',
              {
                pin: this.pin,
                auth: this.authenticated,
                info: this.infoAutentication,
              },
            ]);
          },
        },
        {
          text: 'Sim',
          handler: () => {
            this.storage.set('fingerprint', true);
            this.authFingerPrint();
          },
        },
      ],
    });
    await alert.present();
  }

  /**
   * Verifica a impressão digital do utilizador
   */
  authFingerPrint(): void {
    FingerprintAIO.show({
      title: 'Autenticação Biométrica',
    })
      .then((result) => {
        if (this.authenticated) {
          this.events.publish('fingerprint_done', {});
          this.navCtrl.navigateRoot(['/home', { user_info: 1 }]);
        } else {
          this.events.publish('fingerprint_done', {});
          this.infoAutentication = true;
          this.router.navigate([
            '/pin-auth',
            {
              pin: this.pin,
              auth: this.authenticated,
              info: this.infoAutentication,
            },
          ]);
        }
      })
      .catch((err) => {
        console.log('error', err);
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.myInput.setFocus();
    }, 250);
  }

  /**
   * Handler para alterações no PIN
   */
  onPinChange(value: CustomEvent<SegmentChangeEventDetail>): void {
    this.pinSize = value.detail.value.length;
  }

  /**
   * Para abrir o teclado no PIN
   */
  setFocus(): void {
    if (this.myInput) this.myInput.setFocus();
  }

  /**
   * Handler caso o reader deseje autenticar-se (PSP/GNR)
   */
  authenticate() {
    this.router.navigate(['/login']);
  }

  /**
   * Voltar para a Home em caso de alteração do pin
   */
  goBack() {
    this.navCtrl.navigateRoot(['/home', { user_info: 1 }]);
  }
}

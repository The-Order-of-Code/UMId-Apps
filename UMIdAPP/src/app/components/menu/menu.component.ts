import { Component, OnInit, NgZone, ChangeDetectorRef, Input } from '@angular/core';

import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

import { AlertController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';



@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  @Input() name: any;
  @Input() profile: any;

  fingerprint: boolean;
  message: string;
  version: string;
  biometry = false;
  response = false;
  is_updating = false;

  constructor(
    private changeRef: ChangeDetectorRef,
    private ngZone: NgZone,
    public alertController: AlertController,
    private router: Router,
    private platform: Platform,
    private menu: MenuController,
 
  ) {
    this.name = "Joana Teles Morais";
    this.profile = "Estudante";
    console.log(this.name)

    console.log(this.profile)
   /*this.events.subscribe('fingerprint_done', () => {
      this.storage.get('fingerprint').then((result) => {
        FingerprintAIO.isAvailable().then((has_biometry) => {
          this.fingerprint = result;
          this.biometry = true;
          if (this.fingerprint)
            this.message = 'Desativar Autenticação Biométrica';
          else {
            this.message = 'Ativar Autenticação Biométrica';
            this.fingerprint = false;
          }
        });
      });
    });*/
    //this.versionApp();
  }

  /**
   * Funcionalidade para capturar a versão da aplicação posta no config.xml
   * @memberof MenuComponent
   *
  versionApp(): void {
    this.platform.ready().then(() => {
      this.appVersion.getVersionNumber().then((result) => {
        this.version = result;
      });
    });
  }*/

  /**
   * Funcionalidade mudar PIN
   * @memberof MenuComponent
   */
  changePIN(): void {
    this.router.navigate(['/pin-auth', { auth: true, alteration: true }]);
    this.close();
  }

  /**
   * Aceder ao website do IMT
   * @memberof MenuComponent
   */
  openURL(): void {
    const url = 'https://www.imtonline.pt/';
    if (this.platform.is('ios')) {
      //const browser = this.iab.create(url);
      //browser.show();
    } else {
      window.open(url, '_system', 'location=yes');
    }
  }

  /**
   * Ativar / Desativar autenticação por biometria
   * @memberof MenuComponent
   *
  changeAuth(): void {
    this.ngZone.run(() => {
      if (this.fingerprint) {
        this.fingerprint = false;
        this.storage.remove('fingerprint');
        this.storage.set('fingerprint', false);
        this.message = 'Ativar Autenticação Biométrica';
      } else {
        this.fingerprint = true;
        this.storage.remove('fingerprint');
        this.storage.set('fingerprint', true);
        this.message = 'Desativar Autenticação Biométrica';
      }
      this.changeRef.detectChanges();
    });
  }*/

  /**
   * Retorna o número da carta de condução (guardada na SS)
   *
  async getDocumentNumber(): Promise<string> {
    const ss = SecureStorage.instantiateSecureStorage();
    const mdl = await SecureStorage.get('mdl', ss);
    const mdl_info = JSON.parse(mdl);
    const mdl_data = GeneralMethods.decodeIssuerSignedItems(
      mdl_info.mdl.nameSpaces['org.iso.18013.5.1']
    );
    const document_number = mdl_data['document_number'].elementValue;
    return document_number;
  }*/

  /**
   * Guarda a MDL na SS
   *
  saveMDL(mdl): void {
    const ss = SecureStorage.instantiateSecureStorage();
    SecureStorage.set('mdl', mdl, ss);
  }*/

 

  /**
   * Desassocia MDL eliminando storage e SS
   *
  disassociateMDL(): void {
    const ss = SecureStorage.instantiateSecureStorage();
    SecureStorage.remove('mdl', ss);
    SecureStorage.remove('privateKey', ss);
    SecureStorage.remove('root_cert_gnr', ss);
    SecureStorage.remove('root_cert_psp', ss);
    this.storage.remove('pin');
    this.storage.remove('fingerprint');
    this.router.navigate(['/instructions']);
    this.close();
  }*/

  

  /**
   * Apresenta popup a informar que não existe conetividade
   * Pode fechar, escolher dados ou escolher wifi
   */
  async presentConnectivityAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Problema de conetividade',
      message:
        'Por favor, ligue os dados móveis ou o Wi-Fi para estabelecer conexão ao servidor.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Dados Móveis',
          handler: () => {
           // this.diagnostic.switchToMobileDataSettings();
          },
        },
        {
          text: 'Wi-Fi',
          handler: () => {
            //this.diagnostic.switchToWifiSettings();
          },
        },
      ],
    });

    await alert.present();
  }

  close(): void {
    this.menu.close();
  }
}

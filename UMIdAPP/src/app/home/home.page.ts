import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BarcodeScannerOptions,
  BarcodeScanner,
} from '@ionic-native/barcode-scanner/ngx';
import {
  Platform,
  ToastController,
  NavController,
  MenuController,
} from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { BLE } from '@ionic-native/ble/ngx';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network/ngx';
import { Events } from '../../common/general/events';

import * as SecureStorage from '../../common/general/secureStorage.js';
import * as IgnoreBatterySavingMethod from '../../common/network/reader-mode/ble/doze_mode.js';
import * as ComunicationCrypto from '../../common/crypto/reader-mode/communicationCrypto.js';
import * as GeneralMethods from '../../common/general/reader-mode/general';
import Profile  from '../../common/classes/profile';
import Attribute  from '../../common/classes/attributes';

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
  wifi_option = 1;
  ble_option = 2;
  nfc_option = 3;
  any_option = 4;
  card_info: Object;
  scannedData: unknown;
  barcodeScannerOptions: BarcodeScannerOptions;
  dataLoaded: boolean = false;
  deviceID: any;
  timer: any;
  publicKey: string;
  privateKey: string;



  segment: string;

  constructor(
    private activateRoute: ActivatedRoute,
    private barcodeScanner: BarcodeScanner,
    private ble: BLE,
    private events: Events,
    public platform: Platform,
    private diagnostic: Diagnostic,
    private toastCtrl: ToastController,
    public navCtrl: NavController,
    public bluetoothle: BluetoothLE,
    private menu: MenuController,
    private ngZone: NgZone,
    private storage: Storage,
    private net: Network

  ) {
  }
  
  ngOnInit() {
    this.events.publish('fingerprint_done', {});
    this.menu.enable(true);
    this.activateRoute.paramMap.subscribe(
      async(paramMap) => {
        if (!paramMap.has('user_info')) {
          return;
        }
        else {
          this.items = [];
          const user_info = paramMap.get('user_info');
          console.log(user_info);
          await this.platform.ready();
          const ss = await SecureStorage.instantiateSecureStorage();
          console.log(ss)
          Promise.all([SecureStorage.get('user',ss), SecureStorage.get('mso',ss)]).then(([result,mso])=>{
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
                  this.items.push({name: "Apresentar identificação", icon_name: 'cartao', url: '/holder-ble-transfer', args: {user: result, data_name: "identificação", mso:mso, option: 0}});
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
                this.items.push({name: "Verificar senha", icon_name: 'verificar senha', url: 'scanCode(1)'});
                this.items.push({name: "Verificar identificação", icon_name: 'verificar identidade', url: 'scanCode(0)'});
                this.items.push({name: "Cantina", icon_name: 'cantina', url: '/canteen', args: {userType: user.user.userType}});
                this.items.push({name: "Apresentar identificação", icon_name: 'cartao', url: '/holder-ble-transfer', args: {user: result, data_name: "identificação", mso:mso, option: 0}});
                this.items.push({name: "Ver cartão", icon_name: 'perfil', url: '/card-page', args: {user: result}});
                this.dataLoaded = true;
                break;
              default: break;
            }
            console.log(this.items);
          },
          () => {
            this.ngOnInit()
          })
          
        }
      }
    );
  }


  /**
   * Handler para inicializar o pedido de leitura do QRCode
   * @param {*} option // 0 - consultar identificacão; 1 - senhas;
   * @memberof HomePage
   */
  scanCode(option: number): void {
    let mdl_attributes;

    if (option == 0) {
      mdl_attributes = Profile.prepareRequest(Attribute.identity());
    } else {
      mdl_attributes = Profile.prepareRequest(Attribute.ticket());
    }

    console.log('Atributos:', mdl_attributes);

    if (this.platform.is('android')) {
      this.diagnostic.isLocationEnabled().then(
        (result) => {
          if (result == true) {
            IgnoreBatterySavingMethod.requestPermission().then(() =>
              this.scanCodeOption(option, mdl_attributes)
            );
          } else {
            this.toastMessage(
              'Por favor ative a localização no seu dispositivo.'
            );
          }
        },
        () => {
          this.toastMessage(
            'Por favor ative a localização no seu dispositivo.'
          );
        }
      );
    } else {
      this.scanCodeOption(option, mdl_attributes);
    }
  }

  /**
   * Abre a camara para a leitura do QR Code
   * @param option
   */
  scanCodeOption(option: number, mdl_attributes): void {
    this.barcodeScanner
      .scan({
        prompt:
          'Aponte a câmara para o código QR e a Carta de Condução será lida automaticamente.', // Android
        resultDisplayDuration: 2000, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
        formats: 'QR_CODE', // default: all but PDF_417 and RSS_EXPANDED
        disableAnimations: true, // iOS
        disableSuccessBeep: false, // iOS and Android,
      })
      .then(
        (barcodeData) => {
          if (!barcodeData.cancelled) {
            try {
              this.scannedData = JSON.parse(barcodeData.text);
              const security = this.scannedData['_Security'];
              this.publicKey = security._DeviceKeyBytes;

              // verifica as opções disponíveis
              const transferOption: number = this.scannedData[
                '_TransferMethods'
              ]._type;

              switch (transferOption) {
                case this.ble_option:
                  // caso o outro dispositivo suporte BLE
                  this.bleTreatment(option, mdl_attributes);
                  break;
                default:
                  // caso o outro dispositivo não suporte BLE
                  this.toastMessage(
                    'A aplicação não suporta este modo de comunicação.'
                  );
                  break;
              }
            } catch {
              this.toastMessage('Ocorreu um problema na leitura do QRCode.');
            }
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  /**
   * Tratamento necessário para o estabelecimento da
   * conexão bluetooth
   * @memberof HomePage
   */
  bleTreatment(option: number, mdl_attributes): void {
    // caso o outro dispositivo suporte modo periférico
    if (this.scannedData['_TransferMethods']._TransferOption._perifMode) {
      // reader atua a modo central
      const puuid = this.scannedData['_TransferMethods']._TransferOption
        ._pmuuid;
      const cuuid = this.scannedData['_TransferMethods']._TransferOption
        ._cmuuid;
      this.centralMode(puuid, cuuid, option, mdl_attributes);
    } else {
      // reader atua a modo periférico
      // ...
    }
  }

  /**
   * Ativação do modo central e procede-se para a comunicação BLE
   * @param {*} cuuid // id do outro dispositivo (que está em modo periférico)
   * @memberof HomePage
   */
  centralMode(puuid, cuuid, option: number, mdl_attributes): void {
    if (this.platform.is('android')) {
      this.ble.enable().then(
        (success) => {
          this.bleTransfer(success, puuid, cuuid, option, mdl_attributes);
        },
        () => {
          // enable automatico
          console.log('Bluetooth não está ligado\n');
        }
      );
    } else if (this.platform.is('ios')) {
      this.ble.isEnabled().then(
        (enabled) => {
          this.bleTransfer(
            'scanning on ios',
            puuid,
            cuuid,
            option,
            mdl_attributes
          );
        },
        (disabled) => {
          this.toastMessage('Bluetooth desligado.');
        }
      );
    }
  }

  /**
   * Verfica se há conexão à internet
   * @memberof HomePage
   */
  isConnected(): boolean {
    const conntype = this.net.type;
    return conntype && conntype !== 'unknown' && conntype !== 'none';
  }

  /**
   * Criação da toast message a ser apresentada no dispositivo
   * @param {*} message
   * @memberof HomePage
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
   * Subscrição no dispositivo selecionado
   * e navegação para a página de loading (ble-transfer)
   * @memberof HomePage
   */
  bleTransfer(status, puuid, cuuid, option: number, mdl_attributes): void {
    navigator.geolocation.getCurrentPosition(
      () => ({}),
      () => ({})
    );
    this.ble.scan([puuid], 5).subscribe(
      (device) => {
        this.deviceID = device.id;
        clearTimeout(this.timer);
        const data_name = option == 1? 'senha' : 'identificação';
        this.ngZone.run(() => {
          this.navCtrl.navigateRoot([
            '/reader-ble-transfer',
            {
              id: device.id,
              puuid: puuid,
              public_key: JSON.stringify(this.publicKey),
              option: JSON.stringify(option),
              attributes: JSON.stringify(mdl_attributes),
              device_engagement_structure: JSON.stringify(this.scannedData),
              data_name: data_name
            },
          ]);
        });
      },
      () => {
        this.toastMessage(
          'Erro na conexão com o outro dispositivo\nPor favor tente novamente.'
        );
      },
      () => console.log('Scan complete')
    );

    this.timer = setTimeout(() => {
      if (this.deviceID == '') {
        this.ble.stopScan();
        if (this.platform.is('android')) {
          this.bluetoothle.disable();
        }

        this.toastMessage(
          'Erro na conexão com o outro dispositivo\nPor favor tente novamente.'
        );
        this.navCtrl.navigateRoot(['/home']);
      }
    }, 5000);
  }


  nextPage(_event){
    console.log(_event);
    const ev = JSON.parse(_event);
    console.log(ev)
    if(ev.args){
      this.navCtrl.navigateRoot([ev.url, ev.args]);
    }
    else {
      if (ev.url == 'scanCode(0)') {
        this.scanCode(0)
      } else if (ev.url == 'scanCode(1)') {
        this.scanCode(1)
      }
      else this.navCtrl.navigateRoot([ev.url]);
    }
  }

  goBack(_event) {
    console.log(_event);
  }

  openMenu(): void {
    this.menu.open();
  }


}

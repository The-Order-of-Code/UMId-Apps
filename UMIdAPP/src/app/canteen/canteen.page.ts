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
import * as SecureStorage from '../../common/general/secureStorage.js';
import * as IgnoreBatterySavingMethod from '../../common/network/reader-mode/ble/doze_mode.js';
import Profile  from '../../common/classes/profile';
import Attribute  from '../../common/classes/attributes';

@Component({
  selector: 'app-canteen',
  templateUrl: './canteen.page.html',
  styleUrls: ['./canteen.page.scss'],
})
export class CanteenPage implements OnInit {
  // nome da página (Cantina, Biblioteca, etc.)
  view_name: string;

  // adicionar botao voltar para trás true -> sim, false -> nao (depende da vista)
  has_back_button: boolean;
  
  // lista com items do que queremos colocar na view (designação, datas, horários, etc.)
  items: Object[] = [];

  show_counter: boolean;

  card_type: string;

  dataLoaded: boolean = false;

  segment: string;

  ticket: any;

  wifi_option = 1;
  ble_option = 2;
  nfc_option = 3;
  any_option = 4;
  card_info: Object;
  scannedData: unknown;
  barcodeScannerOptions: BarcodeScannerOptions;
  deviceID: any;
  timer: any;
  publicKey: string;
  privateKey: string;

  constructor(
    private activateRoute: ActivatedRoute,
    private barcodeScanner: BarcodeScanner,
    private ble: BLE,
    public platform: Platform,
    private diagnostic: Diagnostic,
    private toastCtrl: ToastController,
    public navCtrl: NavController,
    public bluetoothle: BluetoothLE,
    private menu: MenuController,
    private ngZone: NgZone,
    private storage: Storage,
    private net: Network
    ) { }

  ngOnInit() {
    this.activateRoute.paramMap.subscribe(
      (paramMap) => {
        if (!paramMap.has('userType')) {
          return;
        }
        else {
          this.view_name = 'Cantina';
          this.items = [];
          const userType = paramMap.get('userType');
          switch (userType) {
            case 'STUDENT':
              // Menu inicial estudante 
                this.has_back_button = true;
                this.show_counter = false;
                this.card_type = "main menu";
                this.items.push({name: "Apresentar senha", icon_name: 'senha', url: '/canteen/choice-ticket'});
                this.items.push({name: "Consultar senhas", icon_name: 'pesquisar senhas', url:'/canteen/search-ticket'});
                this.items.push({name: "Comprar senhas", icon_name: 'comprar senhas', url:'/canteen/buy-ticket'});
                this.dataLoaded = true;
              break; 
            case 'EMPLOYEE':
              // Menu inicial funcionário cantina
              this.has_back_button = true;
              this.show_counter = false;
              this.card_type = "main menu";
              this.items.push({name: "Verificar senha", icon_name: 'verificar senha', url: 'scanCode(1)'});
              this.items.push({name: "Verificar identificação", icon_name: 'verificar identidade', url: 'scanCode(0)'});
              this.items.push({name: "Apresentar senha", icon_name: 'senha', url: '/canteen/choice-ticket'});
              this.items.push({name: "Consultar senhas", icon_name: 'pesquisar senhas', url:'/canteen/search-ticket'});
              this.items.push({name: "Comprar senhas", icon_name: 'comprar senhas', url:'/canteen/buy-ticket'});
              this.dataLoaded = true;
              break;
            default: break;
          }
        }
      }
    );
  }

  /**
   * Handler para inicializar o pedido de leitura do QRCode
   * @param {*} option // 0 - consultar identificacão; 1 - senhas;
   * @memberof CanteenPage
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
   * @memberof CanteenPage
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
   * @memberof CanteenPage
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
   * Criação da toast message a ser apresentada no dispositivo
   * @param {*} message
   * @memberof CanteenPage
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
   * @memberof CanteenPage
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

        this.ngZone.run(() => {
          this.navCtrl.navigateRoot([
            `reader-ble-transfer/${device.id}`,
            {
              puuid: puuid,
              public_key: JSON.stringify(this.publicKey),
              option: JSON.stringify(option),
              attributes: JSON.stringify(mdl_attributes),
              device_engagement_structure: JSON.stringify(this.scannedData)
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

  goBack(_event){
    this.navCtrl.navigateRoot(['/home',{ user_info: 1 }]);
  }

  openMenu(): void {
    this.menu.open();
  }

}

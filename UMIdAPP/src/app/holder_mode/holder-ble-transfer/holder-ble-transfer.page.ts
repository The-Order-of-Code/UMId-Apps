// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';

// @Component({
//   selector: 'app-holder-ble-transfer',
//   templateUrl: './holder-ble-transfer.page.html',
//   styleUrls: ['./holder-ble-transfer.page.scss'],
// })
// export class HolderBleTransferPage implements OnInit {

//   // nome da página (Cantina, Biblioteca, etc.)
//   view_name: string;

//   // adicionar botao voltar para trás true -> sim, false -> nao (depende da vista)
//   has_back_button: boolean;
  
//   show_counter: boolean;

//   createdCode: string;
//   data_name: string;
//   dataLoaded: boolean = false;
//   constructor(private activateRoute: ActivatedRoute, private router: Router) { }

//   ngOnInit() {
//     this.activateRoute.paramMap.subscribe(
//       (paramMap) => {
//         if (!paramMap.has('user') || !paramMap.has('data_name')) {
//           console.log('here');
//           return;
//         }
//         else {
//           this.view_name = "Apresentar " + paramMap.get('data_name');
//           this.has_back_button = true;
//           this.show_counter = false;
//           const user_info = paramMap.get('content');
//           console.log(user_info);
//           this.createdCode = user_info;
//           this.data_name = paramMap.get('data_name');
//           console.log(this.data_name);
//           this.dataLoaded = true;
//         }
//       }
//     );
//   }
  
//   goBack(_event){
//     this.router.navigate(['/home',{ user_info: 1}]);
//   }

// }

import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import * as CBOR from '../../../common/general/holder-mode/cbor.js';
import { v4 as uuidv4 } from 'uuid';
import { MDLServiceCharacteristics } from '../../../common/network/holder-mode/ble/characteristics';

import {
  Platform,
  ToastController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

// Estruturação das informações para engagement
import * as DeviceEngagement from '../../../common/engagement/holder-mode/deviceEngagement';
// Biblioteca de segurança
import * as ComunicationCrypto from '../../../common/crypto/holder-mode/communicationCrypto.js';
import * as CryptoMethods from '../../../common/crypto/holder-mode/crypto';
// Administração de pacotes
import * as FragmentMethods from '../../../common/network/holder-mode/ble/fragmentation';
// Metodos comuns na comunicação
import * as GeneralMethods from '../../../common/general/holder-mode/general';
import * as Translate from '../../../common/general/holder-mode/translate';
// Métodos associados ao tratamento das mensagens enviadas/recebidas
import * as msgStruct from '../../../common/general/holder-mode/request_response_data.js';
import { Subscription } from 'rxjs';

// XState - máquina de estados
import { createMachine, interpret, assign } from 'xstate';

interface HolderContext {
  prepare_tries: number;
}

@Component({
  selector: 'app-holder-ble-transfer',
  templateUrl: './holder-ble-transfer.page.html',
  styleUrls: ['./holder-ble-transfer.page.scss'],
})
export class HolderBleTransferPage {
  isOnlineRequest: boolean;
  loading: HTMLIonLoadingElement;
  promise: Promise<unknown>;
  message: any = new ArrayBuffer(0);
  createdCode: string;
  additionalData: ArrayBuffer;
  skReader: CryptoKey;
  skHolder: CryptoKey;
  transfer_status: number; // isto é uma espécie de descriptor que falta implementar no bluetooth
  counterIntReader: number;
  counterReader: Uint8Array;
  identifierReader: Uint8Array;
  counterIntHolder: number;
  counterHolder: Uint8Array;
  identifierHolder: Uint8Array;
  keys: CryptoKeyPair;
  public_key: CryptoKey;
  cuuid: string;
  uuid: string;
  encodeData: any;
  requestFlag: number; // boolean;
  authorization: boolean;
  cert_reader_public_key: Object; // jwk chave publica que vai no certificado do reader
  option: any;
  icon_name: string;
  title: string;
  success_quote: string;
  failure_quote: string;
  failure_code: string;

  loading_message: string;
  eReaderKey: Object;
  entity: string;
  hidden = false;
  isCodeAlfNumeric: boolean;
  code: string;

  qr = true;
  spinner = false;
  success = false;
  failure = false;
  auth = false;

  read = false;
  isConnected: boolean;
  transfer_timer: NodeJS.Timeout;
  timer: NodeJS.Timeout;
  ios_timer: NodeJS.Timeout;
  /**
   * transfer_progress : variável responsável de
   * sabermos se há uma transferência em curso
   * isso permite saber se a comunicação foi interrompida no BLE
   *
   * @memberof BleTransferPage
   */
  transfer_progress = false;
  subscriptionInitialize: Subscription;
  subscriptionPeripheral: Subscription;

  background_color = '#FDF0F1';
  default_color = '#FDF0F1';
  success_color = '#00A676';
  auth_color = '#006494';

  messages: any = [];
  /**
   * ISO secção 8.2.2.1.6
   * Variável signal_message para representar byte mais significativo da comunicação das mensagens
   * O primeiro byte da mensagem for:
   *
   * 0x01  indica que mais mensagens esta a enviar
   *
   * OU
   *
   * 0x00, indicar que é a última parte da mensagem.
   *
   * @type {number}
   * @memberof BleTransferPage
   */
  signal_message: number;
  ia_certificate: string;
  ia_signature: string;
  mdl: any;
  mdlTransfer: any;
  address: any;
  length: any;
  index: any;
  array: any;

  fail_flag = true; // flag para a vista de insucesso

  ble: any;
  consent: boolean;
  packet_number = 0;
  user_info: any;
  update_date: string;
  mso: any;

  state_machine: any;

  request_attributes: void;

  view_name: string;
  has_back_button: boolean;
  show_counter: boolean;
  data_name: string;
  dataLoaded: boolean = false;

  has_auth = true;

  /**
   * Cria-se uma  instance da classe PeripheralPage.
   * @param {Platform} platform
   * @param {BluetoothLE} bluetoothle
   * @param {ToastController} toastCtrl
   * @param {LoadingController} loadingCtrl
   * @param {NavController} navCtrl
   * @param {ChangeDetectorRef} changeRef
   * @param {ActivatedRoute} activateRoute
   * @memberof PeripheralPage
   */
  constructor(
    public platform: Platform,
    private diagnostic: Diagnostic,
    public alertController: AlertController,
    private bluetoothle: BluetoothLE,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private router: Router,
    public navCtrl: NavController,
    private changeRef: ChangeDetectorRef,
    private activateRoute: ActivatedRoute
  ) {
    /**
     * Sub-máquina de estados
     * Representa os diferentes estados da conexão BLE
     */
    const bleStatusMachine = {
      initial: 'evaluateBLEState',
      states: {
        evaluateBLEState: {
          on: {
            DISABLED: 'disabled',
            ENABLED: 'enabled',
          },
        },
        disabled: {
          entry: '_disabled',
        },
        enabled: {
          initial: 'init',
          on: {
            SUBSCRIBED: 'subscribed',
          },
          states: {
            init: {
              entry: '_enabled',
              on: {
                ISADVERTISING: 'isAdvertising',
              },
            },
            isAdvertising: {
              entry: '_checkIfIsAdvertising',
              on: {
                RENDERBARCODE: 'renderBarcode',
              },
            },
            renderBarcode: {
              entry: '_renderBarcode',
            },
          },
        },
        subscribed: {
          entry: '_subscribed',
          on: {
            WRITEREQUESTED: 'writeRequested',
          },
        },
        notification: {
          entry: '_notify',
          on: {
            NOTIFY: 'notification',
            WRITEREQUESTED: 'writeRequested',
            DISCONNECTED: 'disconnected',
            UNSUBSCRIBED: 'unsubscribed',
          },
        },
        writeRequested: {
          initial: 'init',
          on: {
            WRITEREQUESTED: 'writeRequested',
            NOTIFY: 'notification',
            UNSUBSCRIBED: 'unsubscribed',
          },
          states: {
            init: {
              entry: '_writeRequested',
              on: {
                GENKEYSDECRIPT: 'genkeydecript',
                ENDSESSION: 'endSession',
              },
            },
            genkeydecript: {
              entry: '_genkeydecript',
            },
            endSession: {
              entry: '_endSession',
              on: {
                DECRYPTMSG: 'decryptMsg',
              },
            },
            decryptMsg: {
              entry: '_decryptMsg',
            },
          },
        },
        unsubscribed: {
          entry: '_unsubscribed',
          on: {
            DISCONNECTED: 'disconnected',
          },
        },
        disconnected: {
          entry: '_disconnected',
        },
      },
    };

    /**
     * Máquina de estados para controlar o fluxo das funções
     */
    const machine = createMachine<HolderContext>(
      {
        // Machine identifier
        id: 'ble-transfer',

        // Initial state
        initial: 'zero',

        // Local context for entire machine
        context: {
          prepare_tries: 0,
        },
        on: {
          ERROR: 'error',
        },
        // State definitions
        states: {
          zero: {
            on: {
              START: 'initPage',
            },
          },
          initPage: {
            entry: '_initPage',
            on: {
              DONE: 'prepareDeviceEngagement',
            },
          },
          prepareDeviceEngagement: {
            entry: '_prepareDeviceEngagement',
            on: {
              PREPARED: 'init',
              ERROR: [
                {
                  actions: assign({
                    prepare_tries: (context) => context.prepare_tries + 1,
                  }),
                  target: 'prepareDeviceEngagement',
                  cond: (context, event) => context.prepare_tries < 1,
                },
                //{ target: 'error' }
              ],
            },
            initial: 'generateKey',
            states: {
              generateKey: {
                on: {
                  GENERATED: 'exportKey',
                },
              },
              exportKey: {},
            },
          },
          init: {
            entry: '_init',
            on: {
              INITIALIZED: 'initPeripheral',
            },
          },
          initPeripheral: {
            entry: '_initPeripheral',
            on: {
              EXPIRED: 'expired',
              SUCCESS: 'success',
            },
            ...bleStatusMachine,
          },
          success: {
            entry: '_showDataTransfered',
            type: 'final',
          },
          expired: {
            entry: '_showTimeExpired',
            type: 'final',
          },
          error: {
            entry: '_error',
            type: 'final',
          },
        },
      },
      {
        actions: {
          _initPage: (context, event) => {
            this.initPage();
          },

          _prepareDeviceEngagement: (context, event) => {
            this.prepareDeviceEngagement();
          },

          _init: (context, event) => {
            this.init();
          },

          _initPeripheral: (context, event) => {
            this.initPeripheral();
          },

          _showDataTransfered: (context, event) => {
            this.showDataTransfered();
          },

          _enabled: (context, event) => {
            this.enabled();
          },

          _checkIfIsAdvertising: (context, event) => {
            this.checkIfIsAdvertising();
          },

          _renderBarcode: (context, event) => {
            this.renderBarcode();
          },

          _writeRequested: (context, event) => {
            this.writeRequested(event.payload);
          },

          _genkeydecript: (context, event) => {
            this.genSessionKeysAndDecrypt(event.readerKey, event.payload);
          },

          _endSession: (context, event) => {
            this.endSession(event.payload);
          },

          _decryptMsg: (context, event) => {
            this.decrypt_msg(event.payload);
          },

          _notify: (context, event) => {
            this.notify();
          },

          _subscribed: (context, event) => {
            this.subscribed(event.payload);
          },

          _unsubscribed: (context, event) => {
            console.log('Unsubscribed');
            clearTimeout(this.transfer_timer);
            if (this.platform.is('ios')) {
              if (this.consent) {
                // TODO: CHECK THIS and others
                if (!this.requestFlag && !this.fail_flag) {
                  this.state_machine.send({
                    type: 'ERROR',
                    toast:
                      'Conteúdo solicitado é maior que o disposto a compartilhar.',
                    _code: 'ERR_HA_004',
                  });
                } else {
                  if (!this.transfer_progress) {
                    this.state_machine.send({
                      type: 'ERROR',
                      toast: 'Transferência foi interrompida.',
                      _code: 'ERR_HA_005',
                    });
                  } else {
                    this.state_machine.send('SUCCESS');
                  }
                }
              } else {
                if (!this.transfer_progress) {
                  this.state_machine.send({
                    type: 'ERROR',
                    toast: 'Transferência foi interrompida.',
                    _code: 'ERR_HA_005',
                  });
                }
              }

              this.bluetoothle.stopAdvertising().then((status) => {
                this.bluetoothle.removeAllServices();
              });

              const variables = CryptoMethods.initializeSecureSessionVariables();
              this.matchEachInstanceWithVariable(variables);
            }
          },

          _disconnected: (context, event) => {
            const ble = event.ble;
            clearTimeout(this.transfer_timer);
            if (this.address == ble.address) {
              console.log('Disconnected');
              this.changeRef.detectChanges();
              if (this.consent) {
                if (!this.requestFlag && !this.fail_flag) {
                  this.state_machine.send({
                    type: 'ERROR',
                    toast:
                      'Conteúdo solicitado é maior que o disposto a compartilhar.',
                    _code: 'ERR_HA_004',
                  });
                } else {
                  if (!this.transfer_progress) {
                    this.state_machine.send({
                      type: 'ERROR',
                      toast: 'Transferência foi interrompida.',
                      _code: 'ERR_HA_005',
                    });
                  } else {
                    this.state_machine.send('SUCCESS');
                  }
                }
              } else {
                if (!this.transfer_progress) {
                  this.state_machine.send({
                    type: 'ERROR',
                    toast: 'Transferência foi interrompida.',
                    _code: 'ERR_HA_005',
                  });
                }
              }

              this.bluetoothle.stopAdvertising().then((status) => {
                this.bluetoothle.removeAllServices();
              });

              const variables = CryptoMethods.initializeSecureSessionVariables();
              this.matchEachInstanceWithVariable(variables);
            }
          },

          _showTimeExpired: (context, event) => {
            this.toastMessage('Validade do QRCode ultrapassada.');
            this.navCtrl.navigateRoot(['/home', { user_info: 1 }]);
          },

          _error: (context, event) => {
            if (event._error != undefined) {
              console.error('ERROR');
              console.error('Previous state:', event.state);
              console.error(event._error);
            }
            const message = event.toast
              ? event.toast
              : 'Ocorreu um erro inesperado. Por favor, tente novamente.';

            this.showTransferError(message, event._code);
          },
        },
      }
    );

    this.state_machine = interpret(machine)
      .onTransition((state) => {
        console.log('State changed');
        console.log('To:', state.value);
        console.log('With event:', state.event.type);
      })
      .start();

    this.state_machine.send('START');
  }

  initPage() {
    this.activateRoute.paramMap.subscribe(
      (paramMap) => {
        if (
          !paramMap.has('user') ||
          !paramMap.has('data_name') ||
          !paramMap.has('mso') ||
          !paramMap.has('option')
        ) {
          return;
        }
        this.user_info = paramMap.get('user');
        console.log(this.user_info);
        
        this.mso = paramMap.get('mso');
        this.option = paramMap.get('option');
        this.view_name = "Apresentar " + paramMap.get('data_name');
        this.has_back_button = true;
        this.show_counter = false;
        
        this.data_name = paramMap.get('data_name');
        console.log(this.data_name);
        this.mdl = this.user_info;

      },
      (error) => {
        this.state_machine.send({
          type: 'ERROR',
          _error: error,
          state: this.state_machine.state.value,
          _code: 'ERR_HA_012',
        });
      }
    );

    this.signal_message = 0;
    const variables = CryptoMethods.initializeSecureSessionVariables();
    this.matchEachInstanceWithVariable(variables);
    this.state_machine.send('DONE');
  }

  /**
   * Método que trata da instanciação de cada variável inicializada
   * pelo método CryptoMethods.initializeSecureSessionVariables(); que devolve um JSON Object com esses valores
   * @param variables
   */
  matchEachInstanceWithVariable(variables) {
    this.counterIntReader = variables.counterIntReader;
    this.counterIntHolder = variables.counterIntHolder;
    this.identifierReader = variables.identifierReader;
    this.identifierHolder = variables.identifierHolder;
    this.counterReader = variables.counterReader;
    this.counterHolder = variables.counterHolder;
  }

  /**
   * Método responsável por gerar os parametros de comunicação, para BLE,
   * presentes no qrcode
   * @memberof PeripheralPage
   */
  prepareDeviceEngagement() {
    const scope = this;
    this.uuid = uuidv4();
    this.cuuid = uuidv4();

    ComunicationCrypto.generate_key()
      .then((key) => {
        scope.keys = key;
        ComunicationCrypto.export_key(key.publicKey)
          .then((exported_key) => {
            const version = '1.0';
            const security = new DeviceEngagement.Security('1', exported_key);
            const tf = new DeviceEngagement.TransferMethods(
              2,
              1,
              new DeviceEngagement.BleOptions(true, true, this.uuid, this.cuuid)
            );
            const options = new DeviceEngagement.WebApi();
            const doctypes = [];
            const aplicationSpecific = [];

            this.encodeData = new DeviceEngagement.DeviceEngagement(
              version,
              security,
              tf,
              options,
              doctypes,
              aplicationSpecific
            );
            this.state_machine.send('PREPARED');
          })
          .catch((error) => {
            this.state_machine.send({
              type: 'ERROR',
              _error: error,
              state: this.state_machine.state.value,
              _code: 'ERR_HA_001',
            });
          });
      })
      .catch((error) => {
        this.state_machine.send({
          type: 'ERROR',
          _error: error,
          state: this.state_machine.state.value,
          _code: 'ERR_HA_002',
        });
      });
  }

  /**
   *
   * Criação da toast message a ser apresentada no dispositivo
   * @param {*} message
   * @memberof BleTransferPage
   */
  toastMessage(message) {
    this.toastCtrl
      .create({
        message,
        duration: 8000,
        position: 'top',
      })
      .then((toastr) => {
        toastr.present();
      })
      .catch(() => {
        console.log("Couldn't create the message");
      });
  }

  /**
   * Método verifica se o device é android ou IOS e
   * para ativar o modo periferico do BLE
   */
  init() {
    if (this.platform.is('android')) {
      this.subscriptionInitialize = this.bluetoothle
        .initialize({
          request: false,
          statusReceiver: true,
          restoreKey: 'mdl',
        })
        .subscribe(
          (s) => {
            if (s.status == 'enabled') {
              this.state_machine.send('INITIALIZED');
            } else {
              this.diagnostic.switchToBluetoothSettings();
              this.state_machine.send({
                type: 'ERROR',
                state: this.state_machine.state.value,
                toast:
                  'O Bluetooth encontra-se desligado. Por favor, ligue o Bluetooth e tente novamente.',
                _code: 'ERR_HA_006',
              });
            }
          },
          (error) => {
            this.state_machine.send({
              type: 'ERROR',
              _error: error,
              state: this.state_machine.state.value,
              _code: 'ERR_HA_003',
            });
          }
        );
    }

    if (this.platform.is('ios')) {
      this.state_machine.send('INITIALIZED');
    }
  }

  /**
   * Método inicializa o modo periferico do device
   * @memberof PeripheralPage
   */
  initPeripheral() {
    this.subscriptionPeripheral = this.bluetoothle
      .initializePeripheral({
        request: true,
      })
      .subscribe(
        (ble) => {
          this.ble = ble;
          switch (ble.status) {
            case 'disconnected':
              this.state_machine.send({ type: 'DISCONNECTED', ble: ble });
              break;
            case 'enabled':
              this.state_machine.send('ENABLED');
              break;
            case 'disabled':
              if (this.platform.is('ios')) {
                this.state_machine.send({
                  type: 'ERROR',
                  toast:
                    'O Bluetooth encontra-se desligado. Por favor, ligue o Bluetooth e tente novamente.',
                  _code: 'ERR_HA_006',
                });
              }
              break;
            case 'writeRequested':
              this.state_machine.send({ type: 'WRITEREQUESTED', payload: ble });
              break;
            case 'notificationReady':
              if (this.index <= this.length) {
                this.state_machine.send('NOTIFY');
              } else {
                this.transfer_progress = true;
              }
              break;
            case 'notificationSent':
              if (this.index != this.length) {
                this.state_machine.send('NOTIFY');
              } else {
                this.transfer_progress = true;
              }
              break;
            case 'subscribed':
              this.state_machine.send({ type: 'SUBSCRIBED', payload: ble });
              break;
            case 'unsubscribed':
              this.state_machine.send('UNSUBSCRIBED');
              break;
            default:
              console.log(ble);
              break;
          }
        },
        (error) => {
          this.state_machine.send({
            type: 'ERROR',
            _error: error,
            state: this.state_machine.state.value,
            _code: 'ERR_HA_006',
          });
        }
      );
  }

  /**
   * Indica que aconteceu um erro durante o processo.
   * @param {message} mensagem de erro a mostrar.
   */
  showTransferError(message, code) {
    this.qr = false;
    this.auth = false;
    this.spinner = false;
    this.failure = true;
    this.failure_quote = message;
    this.failure_code = code;
    this.background_color = this.default_color;
    this.changeRef.detectChanges();
  }

  /**
   * Indica que a transferência foi realizada com sucesso
   * apenas se o utilizador não estiver disposto a partilhar os dados necessários
   */
  showDataTransfered() {
    if (this.has_auth) {
      this.qr = false;
      this.auth = false;
      this.spinner = false;
      this.success = true;
      this.background_color = this.success_color;
      this.changeRef.detectChanges();
    }
  }

  /**
   *
   * Gera o device engagement structure e inicia o processo de advertising
   * @memberof BleTransferPage
   */
  enabled() {
    console.log('Device engagement structure: ', this.encodeData);

    this.createService().then(
      (success) => {
        console.log('Service created: ', success);

        this.startAdvert().then(
          (advertiseStatus) => {
            console.log('Advertising: ' + advertiseStatus);

            if (advertiseStatus.status == 'advertisingStarted') {
              this.state_machine.send('ISADVERTISING');
            } else {
              this.state_machine.send({
                type: 'ERROR',
                toast:
                  'Falha no anúncio do dispositivo. Por favor, tente novamente.',
                _code: 'ERR_HA_008',
              });
            }
          },
          (error) => {
            this.state_machine.send('ISADVERTISING');
          }
        );
      },
      (error) => {
        this.state_machine.send({
          type: 'ERROR',
          _error: error,
          toast:
            'Falha na criação do serviço. Por favor, reinicie a aplicação.',
          state: this.state_machine.state.value,
          _code: 'ERR_HA_009',
        });
      }
    );
  }

  /**
   * Método responsável por verificar se o dispositivo está dando
   * advertising ou seja fazendo publicidade no BLE
   *
   * @memberof BleTransferPage
   */
  checkIfIsAdvertising() {
    const scope = this;

    this.bluetoothle.isAdvertising().then(
      (started) => {
        if (started.isAdvertising) {
          this.state_machine.send('RENDERBARCODE');

          if (this.platform.is('ios')) {
            scope.ios_timer = setTimeout(() => {
              scope.bluetoothle
                .stopAdvertising()
                .then((status) => {
                  console.log(status);
                })
                .catch((error) => {
                  this.state_machine.send({
                    type: 'ERROR',
                    _error: error,
                    state: this.state_machine.state.value,
                    _code: 'ERR_HA_010',
                  });
                });
            }, 20000);
          }

          scope.timer = setTimeout(() => {
            scope.changeRef.detectChanges();

            if (!scope.read && scope.qr) {
              scope.state_machine.send('EXPIRED');
            }
          }, 21000);
        } else {
          this.state_machine.send({
            type: 'ERROR',
            toast:
              'Falha no anúncio do dispositivo. Por favor, tente novamente.',
            _code: 'ERR_HA_008',
          });
        }
      },
      (error) => {
        this.state_machine.send({
          type: 'ERROR',
          _error: error,
          toast: 'Falha no anúncio do dispositivo. Por favor, tente novamente.',
          state: this.state_machine.state.value,
          _code: 'ERR_HA_008',
        });
      }
    );
  }

  /**
   *  Método gera o qrcode com a estrutura do engagement
   * @memberof PeripheralPage
   */
  renderBarcode() {
    if (this.encodeData) {
      this.createdCode = JSON.stringify(this.encodeData);
      this.dataLoaded = true;
      this.changeRef.detectChanges();
    } else {
      this.toastCtrl
        .create({
          header: 'Erro',
          message: 'Ocorreu um erro na geração dos dados. Tente outra vez.',
          duration: 5000,
          position: 'top',
        })
        .then((toast) => {
          toast.present();
        });
    }
  }

  /**
   * Método ativa a publicade do periferico durante 20 segundos
   * @returns
   * @memberof PeripheralPage
   */
  startAdvert() {
    console.log('uuid:', this.uuid);
    return this.bluetoothle.startAdvertising({
      services: [this.uuid], // iOS
      service: this.uuid, // Android
      timeout: 20000,
      includeDeviceName: false,
    });
  }

  /**
   *  Método cria serviço no BLE
   * @returns
   * @memberof PeripheralPage
   */
  createService() {
    return this.bluetoothle.addService({
      service: this.uuid,
      characteristics: [
        MDLServiceCharacteristics.State,
        MDLServiceCharacteristics.Client2Server,
        MDLServiceCharacteristics.Server2Client,
      ],
    });
  }

  /**
   *
   * Método cria as chaves de sessão
   * e desencriptação do primeiro request do reader
   * @param {*} eReaderKey
   * @param {*} data
   * @returns
   * @memberof PeripheralPage
   */
  genSessionKeysAndDecrypt(eReaderKey, data) {
    console.log('Deriving keys...');
    const keysp = this.keys;
    CryptoMethods.instantiateSessionKeys(keysp, eReaderKey)
      .then((sessionData) => {
        this.skReader = sessionData[0];
        this.skHolder = sessionData[1];
        this.additionalData = sessionData[2];
        console.log('Decrypting request...');
        console.log(data);
        this.decrypt_msg(data).then(
          () => {
            this.setUI(this.requestFlag);
            if (this.checkRequestFlag()) {
                this.changeUIState('open-authorization');
            } else {
                this.changeUIState('cancel-request');
                this.cancelRequest();
              }
          }
        ).catch((error) => {
            this.state_machine.send({
              type: 'ERROR',
              _error: error,
              state: this.state_machine.state.value,
              _code: 'ERR_HA_014',
            });
          });
      })
      .catch((error) => {
        this.state_machine.send({
          type: 'ERROR',
          _error: error,
          state: this.state_machine.state.value,
          _code: 'ERR_HA_013',
        });
      });
  }

  /**
   * Compara a opção do holder (0-carta; 1-maioridade; 2-perfil)
   * com a opção do reader
   * @returns true - a opção do holder permite o reader obter os dados
   */
  checkRequestFlag(): boolean {
    if (this.option == 0) return true;
    if (this.option == 1 && this.requestFlag == 1) return true;
    if (this.option == 2 && this.requestFlag != 0) return true;
    return false;
  }

  /**
   * Método que cancela o pedido devido ao holder selecionar
   * uma opção que não é valida com a request_flag
   */
  async cancelRequest(): Promise<void> {
    const contentMDL = await msgStruct.createMDLResponse(
      this.mso,
      this.mdl,
      10,
      true,
      this.request_attributes,
      this.isOnlineRequest
    );

    this.notifyData(this.ble.address, contentMDL);
  }

  /**
   * Setup das frases e icones da UI consoante o pedido do holder
   */
  setUI(request_flag: number): void {
    switch (request_flag) {
      case 0:
        this.icon_name = 'card';
        this.title = 'Apresentar Identificação';
        this.success_quote =
          'Os dados da sua identificação foram partilhados com sucesso.';
        this.failure_quote =
          'Não foi possivel partilhar os dados da sua identificação.';
        this.mdl = this.user_info;
        break;
      case 1:
        this.icon_name = 'ticket';
        this.title = 'Apresentar Senha';
        this.success_quote = 'Senha partilhada com sucesso.';
        this.failure_quote = 'Não foi possivel partilhar a sua senha.';
        break;
    }
  }

  /**
   * Define a UI consoante o estado da transferência
   * @param state
   */
  changeUIState(state: string): void {
    switch (state) {
      case 'cancel-request':
        this.icon_name = 'share_data';
        this.title = 'Partilhar dados da carta';
        this.failure_quote =
          'Não selecionou a opção necessária para o respetivo pedido.';
        this.failure = true;
        this.fail_flag = false;
        this.qr = false;
        this.failure = true;
        break;
      case 'open-authorization':
        this.hidden = true;
        this.qr = false;
        this.auth = true;
        this.background_color = this.auth_color;
        break;
      case 'close-authorization':
        this.auth = false;
        this.spinner = true;
        this.background_color = this.default_color;
        break;
      case 'invalid-request':
        this.index = -1;
        this.qr = false;
        this.auth = false;
        this.spinner = false;
        this.failure = true;
        this.background_color = this.default_color;
        break;
      case 'auth-entity':
        this.toastMessage(
          `Agente da ${this.entity.toUpperCase()} está a requisitar os dados.`
        );
        this.hidden = true;
        this.qr = false;
        this.auth = false;
        this.spinner = true;
        this.background_color = this.auth_color;
        break;
    }
    this.changeRef.detectChanges();
  }

  /**
   *
   * Método responde as solicitações feita pelo modo central
   * @param {*} ble
   * @memberof PeripheralPage
   */
  writeRequested(ble) {
    if (ble.characteristic == MDLServiceCharacteristics.Client2Server.uuid) {
      const bytes = this.bluetoothle.encodedStringToBytes(ble.value);
      let data;
      let bufView;

      switch (this.signal_message) {
        case 0:
          // handling multiple packets
          bufView = new Uint8Array(bytes);

          if (bufView[0] == 1) {
            const packet = bytes.slice(1, bytes.byteLength);
            this.message = FragmentMethods.appendBuffer(this.message, packet);
          }
          if (bufView[0] == 0) {
            this.signal_message++;

            const packet = bytes.slice(1, bytes.byteLength);
            this.message = FragmentMethods.appendBuffer(this.message, packet);

            const json = CBOR.decode(this.message); // comunicação 
            this.transfer_status = 1;
            this.message = new ArrayBuffer(0);

            console.log('Received Session Establishment structure: ', json);

            const eReaderKey = CBOR.decode(
              GeneralMethods.str2ab(json._eReaderKey)
            );
            this.eReaderKey = eReaderKey;
            const _data = GeneralMethods.str2ab(json._data);
            this.genSessionKeysAndDecrypt(eReaderKey, _data);
          }
          break;
        case 1:
          console.log('ending session');
          // handling multiple packets
          bufView = new Uint8Array(bytes);

          if (bufView[0] == 1) {
            const packet = bytes.slice(1, bytes.byteLength);
            this.message = FragmentMethods.appendBuffer(this.message, packet);
          }
          if (bufView[0] == 0) {
            this.transfer_progress = true;
            this.signal_message = 0;

            const packet = bytes.slice(1, bytes.byteLength);
            this.message = FragmentMethods.appendBuffer(this.message, packet);

            const json = CBOR.decode(this.message);
            this.message = new ArrayBuffer(0);
            this.transfer_status = 2;
            console.log('Received Session Data for Ending Session: ', json);
            data = GeneralMethods.str2ab(json._data);
            this.endSession(data);
          }
          break;
      }
    } else {
      console.log('Connection Ready.');
    }
  }

  /**
   * Subscrição com o serviço do device em modo periferico
   * @param {*} ble
   * @memberof PeripheralPage
   */
  subscribed(ble) {
    this.read = true;
    clearTimeout(this.timer);

    this.transfer_timer = setTimeout(() => {
      this.state_machine.send({
        type: 'ERROR',
        state: this.state_machine.state.value,
        toast:
          'A transferência demorou mais de 2 minutos. Por favor, tente novamente.',
        _code: 'ERR_HA_017',
      });
    }, 120000);

    console.log(ble.address + ' connected to service uuid: ' + this.uuid);
  }

  /**
   *
   * Pop-up para request dos dados
   * @param {*} data
   * @memberof BleTransferPage
   */
  presentAlertConfirm() {
    // TODO - ver direito
    console.log(this.option, this.requestFlag);
    if (this.option == 1 && this.requestFlag != 1) {
      console.log('presentAlertConfirm 1');
      this.choiceCaseBLE(true);
      console.log('case 1');
    } else {
      if (this.option == 0 && this.requestFlag != 0) {
        console.log('case 2');
        this.option = 1;
        //this.requestFlag = true;
        this.icon_name = 'ticket';
        this.title = 'Apresenhar Senha';
        this.success_quote = 'Senha partilhada com sucesso.';
        this.failure_quote = 'Não foi possivel partilhar a sua senha.';
        this.mdl = this.user_info;
        this.changeRef.detectChanges();
      } else {
        console.log('case 3');
      }
      this.hidden = true;
      this.qr = false;
      this.auth = true;
      this.background_color = this.auth_color;
      this.changeRef.detectChanges();
    }
  }

  /**
   * Método verifica a solicitação do Reader para responder
   * @returns
   * @memberof BleTransferPage
   */
  async choiceCaseBLE(result) {
    this.consent = result;
    let contentMDL;
    console.log('Request attributes', this.request_attributes);
    if (this.consent) {
      this.changeUIState('close-authorization');
      contentMDL = await msgStruct.createMDLResponse(
        this.mso,
        this.mdl,
        0,
        true,
        this.request_attributes,
        this.isOnlineRequest
      );
    } else {
      contentMDL = await msgStruct.createMDLResponse(
        this.mso,
        this.mdl,
        0,
        false,
        this.request_attributes, //this.option == 0 ? 'carta de condução' : 'prova de maioridade',
        this.isOnlineRequest
      );
      this.denyRequest();
    }

    this.notifyData(this.ble.address, contentMDL);
    return contentMDL;
  }

  /**
   * Utilizador rejeita o pedido do reader
   */
  denyRequest(): void {
    this.fail_flag = false;
    this.auth = false;
    this.failure = true;
    this.background_color = this.default_color;
    this.changeRef.detectChanges();
  }

  /**
   *
   * Método faz a publicidade dos dados no modo periferico
   * @param {*} address
   * @param {*} data
   * @memberof PeripheralPage
   */
  async notifyData(address, mdlContent) {
    const arrayBuffer = await this.encrypt_msg(mdlContent);
    console.log('message to send: ', CBOR.decode(arrayBuffer));
    // hash mensagem total
    window.crypto.subtle.digest('SHA-1', arrayBuffer).then((digest) => {
      console.log('hash arraybuffer total message: ', digest);
      console.log('hash total message: ', GeneralMethods.b2str(digest));
    });

    console.log('to send: ' + arrayBuffer);
    this.array = FragmentMethods.splitData(arrayBuffer);

    this.address = address;
    this.length = this.array.length;
    this.index = 0;
    console.log(this.length);

    this.notify();
    console.log('Notifying Data...');
  }

  prepareNotify() {
    const params = {
      service: this.uuid,
      characteristic: MDLServiceCharacteristics.Server2Client.uuid,
      value: this.bluetoothle.bytesToEncodedString(
        new Uint8Array(this.array[this.index])
      ),
      address: this.address,
    };

    this.index++;

    return params;
  }

  notify() {
    if (this.index == 2) {
      this.isConnected = true;
      clearTimeout(this.timer);
    }

    for (let i = 0; i < 1 && this.index != this.length; i++) {
      const params = this.prepareNotify();

      this.bluetoothle.notify(params).then(
        (message) => {
          console.log(message);

          if (!message.sent) {
            this.index--;
          } else {
            if (this.index != this.length) {
              this.notify();
            } else {
              this.transfer_progress = true;
            }
          }
        },
        (error) => {
          this.state_machine.send({
            type: 'ERROR',
            _error: error,
            state: this.state_machine.state.value,
            _code: 'ERR_HA_015',
          });
        }
      );

      if (this.index == 1) {
        this.isConnected = false;

        this.timer = setTimeout(() => {
          console.log(this.isConnected);

          if (!this.isConnected) {
            this.toastMessage('Transferência foi interrompida.');
            this.index = -1;
            this.qr = false;
            this.auth = false;
            this.spinner = false;
            this.failure = true;
            this.background_color = this.default_color;
            this.changeRef.detectChanges();
          }
        }, 3000);
      }
    }
  }

  /**
   *
   * Fim da sessão
   * @param {*} data
   * @memberof PeripheralPage
   */
  endSession(data) {
    console.log('Decrypting message...');
    this.state_machine.send({ type: 'DECRYPTMSG', payload: data });
  }

  /**
   *
   * Função para encriptar a mensagem a ser enviada
   * @param {*} data
   * @returns
   * @memberof PeripheralPage
   */
  async encrypt_msg(data) {
    const string = await CryptoMethods.encrypt_msg(
      data,
      this.additionalData,
      this.counterIntHolder,
      this.identifierHolder,
      this.skHolder
    );
    console.log('Session Data structure for data response:', string);
    return string;
  }

  /**
   *
   * Desencriptar a mensagem recebida
   * @param {*} data
   * @memberof PeripheralPage
   */
  async decrypt_msg(data) {
    const reader_message = await CryptoMethods.decrypt_msg(
      data,
      this.additionalData,
      this.counterIntReader,
      this.identifierReader,
      this.skReader
    );
    let decodeMessage;
    console.log(reader_message);
    console.log(this.transfer_status);
    switch (this.transfer_status) {
      case 1: // Verifica-se o pedido solicitado é igual a opção requisitada pelo holder
        decodeMessage = await msgStruct.getRequestOption(
          this.encodeData,
          this.eReaderKey,
          reader_message
        );
        this.entity = decodeMessage.entity;
        this.requestFlag = parseInt(decodeMessage.request_flag); 
        this.isOnlineRequest = decodeMessage.isOnlineRequest;
        this.request_attributes = decodeMessage.request_attributes;

        console.log('isOnlineRequest', this.isOnlineRequest);
        break;
      case 2:
        console.log('end session message: ', reader_message);
        decodeMessage = reader_message;
        break;
      default:
        break;
    }
    console.log('Data decrypted: ', reader_message);
  }

  /**
   * Tradução do código dos atributos para linguagem corrente (UI)
   */
  translateRequestAttributes(): Array<string> {
    return Translate.translateList(this.request_attributes);
  }

  /**
   *
   * Voltar para a página inicial
   * @memberof PeripheralPage
   */
  goBack(_event) {
    this.navCtrl.navigateRoot(['/home', { user_info: 1 }]);
  }

  /**
   *
   * Utilizador recusou partilhar dados
   * @memberof PeripheralPage
   */
  refuse(_event) {
    this.choiceCaseBLE(false);
  }

  /**
   *
   * Utilizador aceitou partilhar dados
   * @memberof PeripheralPage
   */
  accept(_event) {
    this.choiceCaseBLE(true);
  }

  ionViewWillLeave() {
    clearTimeout(this.transfer_timer);
    clearTimeout(this.timer);
    clearTimeout(this.ios_timer);

    if (this.subscriptionInitialize) {
      this.subscriptionInitialize.unsubscribe();
    }

    this.subscriptionPeripheral.unsubscribe();

    this.bluetoothle.isEnabled().then((isEnableStatus) => {
      console.log(isEnableStatus);

      if (isEnableStatus.isEnabled) {
        this.bluetoothle.stopAdvertising().then(
          (status) => {
            console.log('Stopped advertise ' + status);
            console.log('Removing all services');
            this.bluetoothle.removeAllServices().then(
              (status) => {
                console.log(status);
              },
              (err) => {
                console.log(err);
              }
            );
          },
          (err) => {
            console.log('Error stopping advertise ', err);
            console.log('Removing all services');
            this.bluetoothle.removeAllServices().then(
              (status) => {
                console.log(status);
              },
              (err) => {
                console.log(err);
              }
            );
          }
        );
      }
    });
  }
}

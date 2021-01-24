import { ActivatedRoute, Router } from '@angular/router';
import { BLE } from '@ionic-native/ble/ngx';
import * as DeviceEngagement from '../../../../common/engagement/reader-mode/deviceEngagement';
import * as ComunicationCrypto from '../../../../common/crypto/reader-mode/communicationCrypto.js';
import * as CryptoMethods from '../../../../common/crypto/reader-mode/crypto';
import * as FragmentationMethods from '../../../../common/network/reader-mode/ble/fragmentation';
import * as GeneralMethods from '../../../../common/general/reader-mode/general';
import * as MsgStruct from '../../../../common/general/reader-mode/request_response_data.js';
import * as CBOR from '../../../../common/general/reader-mode/cbor.js';
import { Subscription } from 'rxjs';
import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { Platform, ToastController, LoadingController, NavController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { MDLServiceCharacteristics } from '../../../../common/network/reader-mode/ble/characteristics';
import { RequestResponseService } from '../../../../services/request_response/request-response.service';
import { instantiateSecureStorage, get } from '../../../../common/general/secureStorage';
import { Storage } from '@ionic/storage';

// XState - máquina de estados
import { createMachine, interpret, assign, Interpreter} from 'xstate';
interface ReaderContext {
  treating_mdl_mode : string;
  finished: boolean;
}

@Component({
  selector: 'app-reader-ble-transfer',
  templateUrl: './reader-ble-transfer.page.html',
  styleUrls: ['./reader-ble-transfer.page.scss'],
})
export class ReaderBleTransferPage implements OnInit {
  isOnlineRequest: boolean;
  loading: HTMLIonLoadingElement;
  message: any = new ArrayBuffer(0);
  reader_public_key: CryptoKey;
  holder_public_key: CryptoKey;
  skReader: any;
  skHolder: any;
  counterIntReader: number;
  counterReader: Uint8Array;
  identifierReader: Uint8Array;
  counterIntHolder: number;
  counterHolder: Uint8Array;
  identifierHolder: Uint8Array;
  additionalData: any;
  peripheral: any = {};
  statusMessage: string;
  id: string;
  messages: any = [];
  session_establish = 0;
  data_session = 1;
  end_session = 2;
  act_state: number;
  request: ArrayBuffer;
  request_flag: string;
  mdl_data: string;
  packet_number = 0;
  entity: string; // entidade do reader (gnr, psp ou nenhuma)
  icon_name: string;
  title: string;
  success_quote: string;
  failure_quote: string;
  failure_code: string;
  age_request: boolean;
  portrait: string;
  data_expired: boolean;
  timer: any;
  request_attributes: Array<string>;
  hidden = false;
  subscription: Subscription;
  puuid: string;
  spinner: boolean;
  success = false;
  failure = false;
  has_back_button: boolean;
  show_counter: boolean;
  loading_message: string;
  dataLoaded: boolean = false;
  background_color = '#ECF8F8';
  default_color = '#ECF8F8';
  success_color = '#00A676';

  state_machine: Interpreter<any, any, any, any>;

  constructor(
    private activateRoute: ActivatedRoute,
    private ble: BLE,
    private ngZone: NgZone,
    private plt: Platform,
    private toastCtrl: ToastController,
    private router: Router,
    public loadingController: LoadingController,
    private changeRef: ChangeDetectorRef,
    private reqRespService: RequestResponseService,
    private storage: Storage,
    private net: Network,
    public navCtrl: NavController
  ) {
    const machine = createMachine<ReaderContext>(
      {
        // Machine identifier
        id: 'reader-ble-transfer',

        // Initial state
        initial: 'zero',

        context: {
          treating_mdl_mode: '',
          finished: false,
        },

        on: {
          BLUETOOTHOFF: 'bluetoothOff',
          ERROR: 'error',
        },
        // State definitions
        states: {
          zero: {
            on: {
              START: 'prepareSessionKeys',
            },
          },
          prepareSessionKeys: {
            entry: '_prepareSessionKeys',
            initial: 'checkingParams',
            states: {
              checkingParams: {
                on: {
                  READY: 'parsingParams',
                },
              },
              parsingParams: {
                on: {
                  PARSED: 'generatingKeys',
                },
              },
              generatingKeys: {
                on: {
                  GENERATED: 'creatingReaderRequest',
                },
              },
              creatingReaderRequest: {
                entry: '_treatRequestFlag',
                on: {
                  CREATED: 'instantiatingSessionKeys',
                },
              },
              instantiatingSessionKeys: {
                entry: '_instantiateSessionKeys',
              },
            },
            on: {
              INSTANTIATED: 'deviceSelected',
            },
          },
          deviceSelected: {
            entry: '_deviceSelected',
            on: {
              CONNECTED: 'onConnected',
            },
          },
          onConnected: {
            entry: '_onConnected',
            initial: 'checkingPlatform',
            states: {
              checkingPlatform: {
                on: {
                  IOS: 'bleConnection',
                  ANDROID: 'requestMTU',
                },
              },
              requestMTU: {
                entry: '_processAndroid',
                on: {
                  REQUESTED: 'bleConnection',
                },
              },
              bleConnection: {
                type: 'parallel',
                entry: '_subscribeDevice',
                states: {
                  functional: {
                    initial: 'receivingPackets',
                    states: {
                      receivingPackets: {
                        entry: '_receivePackets',
                        on: {
                          RECEIVED: 'receivingPackets',
                          LAST: 'decryptingMsg',
                        },
                      },
                      decryptingMsg: {
                        initial: 'cryptoDecryptingMsg',
                        states: {
                          cryptoDecryptingMsg: {
                            on: {
                              DECRYPTEDRESPONSE: 'treatingMDLResponse',
                            },
                          },
                          treatingMDLResponse: {
                            on: {
                              TREATEDONLINE: {
                                actions: assign({
                                  treating_mdl_mode: () => 'Online',
                                }),
                                target: 'treatingParsedMDL',
                              },
                              TREATEDOFFLINE: {
                                actions: assign({
                                  treating_mdl_mode: () => 'Offline',
                                }),
                                target: 'treatingParsedMDL',
                              },
                            },
                          },
                          treatingParsedMDL: {
                            on: {
                              SUCCESS: {
                                actions: assign({
                                  finished: (context) => true,
                                }),
                                target: 'success',
                              },
                              FAILURE: {
                                actions: assign({
                                  finished: (context) => true,
                                }),
                                target: 'failure',
                              },
                            },
                          },
                          success: {
                            type: 'final',
                          },
                          failure: {
                            type: 'final',
                            entry: '_failure',
                          },
                        },
                      },
                    },
                  },
                  connection: {
                    initial: 'subscribed',
                    states: {
                      subscribed: {
                        on: {
                          UNSUBSCRIBE: 'unsubscribed',
                        },
                      },
                      unsubscribed: {
                        entry: '_unsubscribe',
                        type: 'final',
                      },
                    },
                  },
                },
              },
            },
          },
          error: {
            type: 'final',
            entry: '_error',
          },
          bluetoothOff: {
            type: 'final',
            entry: '_cancel',
          },
        },
      },
      {
        actions: {
          _prepareSessionKeys: () => {
            this.prepareSessionKeys();
          },

          _treatRequestFlag: (_, event) => {
            const {
              request_flag,
              request_attributes,
              localKey,
              signing_keypair,
              deviceEngagementStruct,
            } = event.payload;

            this.treatRequestFlag(
              request_flag,
              request_attributes,
              localKey,
              signing_keypair,
              deviceEngagementStruct
            );
          },

          _instantiateSessionKeys: (_, event) => {
            const localKey = event.payload;
            this.instantiateKeys(localKey, this.holder_public_key);
          },

          _deviceSelected: () => {
            this.deviceSelected(this.id);
          },

          _onConnected: (_, event) => {
            const peripheral = event.payload;
            this.onConnected(peripheral);
          },

          _subscribeDevice: () => {
            this.subscribeDevice(this.peripheral.id);
            const array = FragmentationMethods.splitData(new ArrayBuffer(0));
            this.ble
              .writeWithoutResponse(
                this.peripheral.id,
                this.puuid,
                MDLServiceCharacteristics.State.uuid,
                array[0]
              )
              .then(() =>
                this.sendToDevice(
                  this.peripheral.id,
                  this.request,
                  this.session_establish,
                  MDLServiceCharacteristics.Client2Server.uuid
                )
              );
          },

          _receivePackets: (_, event) => {
            const data = event.payload;
            this.receivePackets(data);
          },

          _processAndroid: () => {
            this.requestMTU(150);
          },

          _unsubscribe: (_, event) => {
            const address = event.payload;
            this.unsubscribe(address);
          },

          _failure: (_, event) => {
            this.age_request = false;
            this.spinner = false;
            this.failure = true;
            this.failure_quote = event.toast;
            this.changeRef.detectChanges();
          },

          _error: (_, event) => {
            // DEBUGGING ERRORS
            console.error('ERROR', event._code);
            console.error('Previous state:', event.state);
            console.error(event._error);

            // UI ERRORS
            this.spinner = false;
            this.failure = true;
            this.success = false;
            this.age_request = false;
            this.failure_quote = event.toast
              ? event.toast
              : 'Ocorreu um erro inesperado. Por favor, tente novamente.';
            this.failure_code = event._code;
            this.title = 'Erro na leitura';
            this.changeRef.detectChanges();
          },

          _cancel: () => {
            this.toastMessage('Bluetooth desligado!');
            this.navCtrl.navigateRoot(['/home', { mdl_info: 1 }]);
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

    //this.initializeVariables();
    const variables = CryptoMethods.initializeSecureSessionVariables();
    this.matchEachInstanceWithVariable(variables);
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
      });
  }

  /**
   *
   * Verfica se há conexão à internet
   * @memberof HomePage
   */
  isConnected(): boolean {
    const conntype = this.net.type;
    return conntype && conntype !== 'unknown' && conntype !== 'none';
  }

  ngOnInit() {
    console.log("aqui")
    this.storage.get('isOnline').then(
      (value) => {
        console.log(value);
        this.isOnlineRequest = value == true;
        console.log(
          'Scanning for devices with service uuid: 5c8256b5-225f-45e6-a102-f9307a4d30c4'
        );
        // show loading component
        this.subscription = this.ble
          .startStateNotifications()
          .subscribe((status) => {
            console.log('status ' + status);
            if (status == 'turningOff' || status == 'off') {
              this.state_machine.send('BLUETOOTHOFF');
            }
          });

        this.state_machine.send('START');

        console.log('online', this.isOnlineRequest);
      },
      (error) => {
        this.state_machine.send({
          type: 'ERROR',
          _error: error,
          state: this.state_machine.state.value,
          _code: 'ERR_RA_001',
        });
      }
    );
  }

  /**
   * Tratamento dos parâmetros do link da página ble-transfer/:id
   * e importação da chave pública lida pelo QR code
   * @memberof BleTransferPage
   */
  prepareSessionKeys() {
    this.activateRoute.paramMap.subscribe(
      (paramMap) => {
        console.log('param:', paramMap);
        if (
          !paramMap.has('id') ||
          !paramMap.has('public_key') ||
          !paramMap.has('option') ||
          !paramMap.has('device_engagement_structure')
        ) {
          return;
        }

        this.state_machine.send('READY');

        this.id = paramMap.get('id');
        console.log('Device with address: ' + this.id + ' found');

        this.puuid = paramMap.get('puuid');
        this.entity = paramMap.get('entity');
        console.log(this.entity);
        this.holder_public_key = JSON.parse(paramMap.get('public_key'));
        console.log(
          'Holder public key (from QRCode): ',
          JSON.stringify(this.holder_public_key)
        );
        this.request_flag = paramMap.get('option');

        // TODO: attributes -> <Key, Value> : <atributo, to_save>
        // verificar como fica o to_save
        this.request_attributes = Object.keys(
          JSON.parse(paramMap.get('attributes'))
        );
        console.log('PARSED REQUEST ATTRIBUTES:', this.request_attributes);

        const deviceEngagementStruct = JSON.parse(
          paramMap.get('device_engagement_structure')
        );
        this.loading_message = 'A obter ' + paramMap.get('data_name');
        console.log('typeOf request flag: ', typeof(this.request_flag));
        if (JSON.parse(this.request_flag) == 0) {
          this.title = 'Verificar Identificação';
        }
        else {
          this.title = 'Verificar Senha';
        }
        this.has_back_button = true;
        console.log(this.title)
        this.spinner = true;
        this.state_machine.send('PARSED');

        Promise.all([
          ComunicationCrypto.generate_key(),
          ComunicationCrypto.generate_signing_key(),
        ])
          .then(([localKey, signing_keypair]) => {
            this.reader_public_key = localKey.publicKey;
            const payload = {
              request_flag: this.request_flag,
              request_attributes: this.request_attributes,
              localKey,
              signing_keypair,
              deviceEngagementStruct,
            };
            this.dataLoaded = true;
            this.state_machine.send({ type: 'GENERATED', payload: payload });
          })
          .catch((error) => {
            this.dataLoaded = true;
            this.state_machine.send({
              type: 'ERROR',
              _error: error,
              state: this.state_machine.state.value,
              _code: 'ERR_RA_002',
            });
          });
      },
      (error) => {
        this.state_machine.send({
          type: 'ERROR',
          _error: error,
          state: this.state_machine.state.value,
          _code: 'ERR_RA_003',
        });
      }
    );
  }

  /**
   * Método auxiliar para ser possível mudar o estado da máquina
   * @param local_key
   * @param holder_public_key
   */
  instantiateKeys(local_key, holder_public_key) {
    CryptoMethods.instantiateSessionKeys(local_key, holder_public_key)
      .then((sessionData) => {
        this.skReader = sessionData[0];
        this.skHolder = sessionData[1];
        this.additionalData = sessionData[2];
        console.log('Connecting to device ...');

        this.state_machine.send('INSTANTIATED');
      })
      .catch((error) => {
        this.state_machine.send({
          type: 'ERROR',
          _error: error,
          state: this.state_machine.state.value,
          _code: 'ERR_RA_004',
        });
      });
  }

  /**
   * Método que cria a estrutura do reader request a ser enviado
   * para o holder de acordo com a opção que o utilizador escolheu
   * @param request_flag
   * @param localKey
   * @param signing_keypair
   * @param deviceEngagementStruct
   */
  treatRequestFlag(
    request_flag,
    request_attributes,
    localKey,
    signing_keypair,
    deviceEngagementStruct
  ) {
    MsgStruct.createReaderRequest(
      deviceEngagementStruct,
      localKey.publicKey, // chave publica usada para gerar a chave de sessão
      request_flag,
      request_attributes,
      this.entity,
      this.isOnlineRequest
    ).then(
      (request) => {
        this.request = request;
        // TODO : refactor this:
        console.log('FLAG:', request_flag);
        this.show_counter = false;
        if (request_flag == '0') {
          this.icon_name = 'card';
        } else if (request_flag == '1') {
          this.title = 'Verificar Senha';
          this.icon_name = 'ticket';
          this.success_quote = 'Senha validada.';
          this.failure_quote =
            'Não foi possível receber a senha.';
        }
        this.state_machine.send({ type: 'CREATED', payload: localKey });
      },
      (error) => {
        this.state_machine.send({
          type: 'ERROR',
          _error: error,
          state: this.state_machine.state.value,
          _code: 'ERR_RA_005',
        });
      }
    );
  }

  /**
   *
   * Desconectar do periférico quando a página é finalizada
   * @memberof BleTransferPage
   */
  ionViewWillLeave() {
    clearTimeout(this.timer);

    console.log('Unsubscribing');
    this.subscription.unsubscribe();

    console.log('Disconnecting');
    this.ble.disconnect(this.id).then((status) => console.log(status));
  }

  /**
   *
   * Selecionar device em modo periferico
   * ao qual se leu o uuid no qrcode
   * @param {*} id
   * @memberof BleTransferPage
   */
  deviceSelected(id) {
    this.ble.connect(id).subscribe(
      (peripheral) => {
        this.state_machine.send({ type: 'CONNECTED', payload: peripheral });
      },
      (error) => {
        console.log('The peripheral disconnected');
        if (!this.state_machine.state.context.finished) {
          this.state_machine.send({
            type: 'ERROR',
            _error: error,
            state: this.state_machine.state.value,
            toast:
              'O periférico desconectou-se inesperadamente. Por favor, tente novamente.',
            _code: 'ERR_RA_006',
          });
        }
      },
      () => console.log('complete')
    );
  }

  /**
   *
   * Conectar-se com o device selecionado
   * @param {*} peripheral
   * @memberof BleTransferPage
   */
  async onConnected(peripheral) {
    this.timer = setTimeout(() => {
      this.toastMessage(
        'A transferência demorou mais de 2 minutos. Tente outra vez.'
      );
      this.navCtrl.navigateRoot(['home', { mdl_info: 1 }]);
    }, 120000);

    this.ngZone.run(() => {
      console.log('');
      this.peripheral = peripheral;
    });

    this.peripheral = peripheral;
    console.log('Connected to ', peripheral.name || peripheral.id);

    if (this.plt.is('ios')) {
      this.state_machine.send('IOS');
    } else {
      this.state_machine.send('ANDROID');
    }
  }

  /**
   *
   * Pedir MTU por parte do GATTClient -> Secção 8.2.2.1.4 Connection setup na ISO
   * Apenas está implementado do lado do Android (no Iphone o tamanho é fixo)
   * @param {*} size
   * @memberof BleTransferPage
   */
  requestMTU(size) {
    this.ble.requestMtu(this.peripheral.id, size).then(
      (mtu) => {
        console.log('Mtu changed to ', mtu);
        this.state_machine.send('REQUESTED');
      },
      (error) => {
        this.state_machine.send({
          type: 'ERROR',
          _error: error,
          state: this.state_machine.state.value,
          _code: 'ERR_RA_007',
        });
      }
    );
  }

  /**
   *
   * Subscrição com o device do modo periferico (holder)
   * @param {*} address
   * @memberof BleTransferPage
   */
  subscribeDevice(address) {
    console.log('Subscribing bluetooth service ...');

    this.ble
      .startNotification(
        address,
        this.puuid,
        MDLServiceCharacteristics.Server2Client.uuid
      )
      .subscribe(
        (data) => {
          console.log('data returned: ', data);
          this.state_machine.send({ type: 'RECEIVED', payload: data });
        },
        (error) => {
          if (!this.state_machine.state.context.finished) {
            this.state_machine.send({
              type: 'ERROR',
              _error: error,
              state: this.state_machine.state.value,
              _code: 'ERR_RA_008',
            });
          }
        },
        () => 'Complete'
      );

    this.ble
      .startNotification(
        address,
        this.puuid,
        MDLServiceCharacteristics.State.uuid
      )
      .subscribe(
        (data) => {
          // TODO - VER QUANDO ACONTECE
          console.log('data returned: ', data);
        },
        (error) => {
          // TODO - STATE MACHINE
          console.log('error starting notification');
        },
        () => 'Complete'
      );
  }

  /**
   *
   * Receção e tratamento dos pacotes
   * @param {*} bytes
   * @param {*} address
   * @memberof BleTransferPage
   */
  receivePackets(bytes) {
    if (bytes == undefined) return;

    bytes = bytes[0];
    console.log('Received packet...');
    const bufView = new Uint8Array(bytes);
    let packet;

    if (bufView[0] == 1) {
      packet = bytes.slice(1, bytes.byteLength);
      this.packet_number++;
      this.message = FragmentationMethods.appendBuffer(this.message, packet);
    }
    if (bufView[0] == 0) {
      packet = bytes.slice(1, bytes.byteLength);
      this.message = FragmentationMethods.appendBuffer(this.message, packet);

      this.state_machine.send('LAST');

      // TODO - PARA QUE?
      crypto.subtle.digest('SHA-1', this.message).then((digest) => {
        console.log('hash arraybuffer total message: ', digest);
        console.log('hash total message: ', GeneralMethods.b2str(digest));
      });

      console.log(this.message);
      try {
        const json = CBOR.decode(this.message);
        console.log(json);
        this.message = new ArrayBuffer(0);

        console.log('Received Data...');
        console.log(
          'Received Session Data structure for data response: ' +
            JSON.stringify(json)
        );
        const _data = GeneralMethods.str2ab(json._data);
        console.log('_data', _data);
        this.decrypt_msg(_data)
          .then((x) => console.log('done'))
          .catch((error) => {
            this.state_machine.send({
              type: 'ERROR',
              _error: error,
              state: this.state_machine.state.value,
              _code: 'ERR_RA_009',
            });
          });
      } catch (error) {
        this.state_machine.send({
          type: 'ERROR',
          _error: error,
          state: this.state_machine.state.value,
          _code: 'ERR_RA_012',
        });
      }
    }
  }

  /**
   *
   * Desencriptar a mensagem recebida
   * @param {*} data
   * @memberof BleTransferPage
   */
  async decrypt_msg(data) {
    const holder_response = await CryptoMethods.decrypt_msg(
      data,
      this.additionalData,
      this.counterIntHolder,
      this.identifierHolder,
      this.skHolder
    );
    this.state_machine.send('DECRYPTEDRESPONSE');

    let mdl;
    if (holder_response === null) {
      if (this.request_flag === '0' && !this.isOnlineRequest) mdl = '-3';
      else mdl = '-5';
      this.state_machine.send('TREATEDOFFLINE');
      this.treat_parsed_mdl(mdl);
    } else {
      console.log('Data decrypted: ', holder_response);
      this.mdl_data = holder_response;
      const status = holder_response.status;
      if (status == 10) {
        mdl = '-2';
        this.state_machine.send('TREATEDOFFLINE');
        this.treat_parsed_mdl(mdl);
      } else {
        if (this.isOnlineRequest) {
          const jwt: string = await MsgStruct.treatOnlineMDLResponse(
            holder_response
          );
          console.log('jwt', jwt);

          if (jwt) {
            // switch (this.request_flag) {
            //   case '0':
            //     fieldsRequested = this.reqRespService.getAllFields();
            //     break;
            //   case '1':
            //     fieldsRequested = this.reqRespService.getOver18Fields();
            //     break;
            // }

            if (this.isConnected()) {
              if(this.request_flag == '0'){
                this.reqRespService.getMDL(jwt).then(
                  async (data) => {
                    if (data.status == 200) {
                      console.log(data)
                      mdl = await this.reqRespService.treatResponse(
                        data.data,
                        this.request_flag
                      );
                    } else {
                      mdl = '-3';
                    }
                    this.state_machine.send('TREATEDONLINE');
                    this.treat_parsed_mdl(mdl);
                  },
                  (error) => {
                    console.log(error);
                    if (error.status == 403) {
                      mdl = '-6';
                    } else {
                      mdl = '-4';
                    }
                    this.state_machine.send('TREATEDONLINE');
                    this.treat_parsed_mdl(mdl);
                  }
                );
              }
              else {
                this.reqRespService.validateTicket(jwt).then(
                  async (data) => {
                    if (data.status == 200) {
                      console.log('success');
                      this.background_color = this.success_color;
                      this.spinner = false;
                      this.success = true;
                      this.changeRef.detectChanges();
                    } else {
                      mdl = '-3';
                    }
                    this.state_machine.send('TREATEDONLINE');
                    this.treat_parsed_mdl(mdl);
                  },
                  (error) => {
                    console.log(error);
                    if (error.status == 404) {
                      mdl = '-7';
                    } else { if (error.status == 403) {
                      mdl = '-6';
                    } else {
                      mdl = '-4';
                    }
                    }
                    this.state_machine.send('TREATEDONLINE');
                    this.treat_parsed_mdl(mdl);
                  }
                );
              }
            } else {
              mdl = '-4';
              this.state_machine.send('TREATEDONLINE');
              this.treat_parsed_mdl(mdl);
            }
          } else {
            mdl = '-1';
            this.state_machine.send('TREATEDONLINE');
            this.treat_parsed_mdl(mdl);
          }
        } else {
          mdl = await MsgStruct.treatMDLResponse(
            holder_response,
            this.request_flag
          );
          this.state_machine.send('TREATEDOFFLINE');
          this.treat_parsed_mdl(mdl);
        }
      }
    }
  }

  /**
   * Método que trata a mdl conforme a flag ou estrutura que recebe como @param
   * @param mdl
   */
  treat_parsed_mdl(mdl) {
    clearTimeout(this.timer);

    this.sendToDevice(
      this.peripheral.id,
      this.request,
      this.end_session,
      MDLServiceCharacteristics.State.uuid
    );

    switch (mdl) {
      case null:
        this.state_machine.send({
          type: 'FAILURE',
          toast: 'Os dados transferidos não são válidos.',
        });
        break;
      case '-1':
        this.state_machine.send({
          type: 'FAILURE',
          toast: 'O utilizador rejeitou a transferência.',
        });
        break;
      case '-2':
        this.state_machine.send({
          type: 'FAILURE',
          toast:
            'Foram solicitados atributos para além daqueles que o utilizador estava disposto a partilhar.',
        });
        break;
      case '-3':
        this.state_machine.send({
          type: 'FAILURE',
          toast: 'Erro na leitura dos dados. Por favor, tente novamente.',
        });
        break;
      case '-4':
        this.state_machine.send({
          type: 'FAILURE',
          toast:
            'Erro na conexão ao servidor. Verifique a ligação à internet ou proceda à transferência offline.',
        });
        break;
      case '-5':
        this.state_machine.send({
          type: 'FAILURE',
          toast:
            'Erro na leitura dos dados. Caso esteja a usar o modo de comunicação offline, tente novamente usando o modo online.',
        });
        break;
      case '-6':
        this.state_machine.send({
          type: 'FAILURE',
          toast:
            'Erro na verificação dos dados. O documento está atualmente associado a outro dispositivo.',
        });
        break;
      case '-7':
        this.state_machine.send({
          type: 'FAILURE',
          toast:
            'Erro na validação da senha. Senha não encontrada.',
        });
        break;
      default:
        this.data_expired = false;
        this.state_machine.send('SUCCESS');
        
        if (this.request_flag == '0') {
          this.ionViewWillLeave()
          this.navCtrl.navigateRoot([
            '/card-page',
            { user: mdl },
          ]);
        }
        // TODO - PERFIL
        // else {
        //   const mdl_info = JSON.parse(mdl);
        //   mdl_info.mdl = JSON.parse(mdl_info.mdl);
        //   this.age_request = true;
        //   this.background_color = this.success_color;
        //   this.spinner = false;
        //   this.success = true;
        //   this.changeRef.detectChanges();
        //   this.toastMessage(Object.keys(mdl_info.mdl).length);
        // }
        break;
    }
  }

  /**
   *
   * Encriptação da mensagem a ser enviada
   * @param {*} data
   * @returns
   * @memberof BleTransferPage
   */
  async encrypt_msg(data) {
    const msg = await CryptoMethods.encrypt_msg(
      data,
      this.additionalData,
      this.counterIntReader,
      this.identifierReader,
      this.skReader
    );
    return msg;
  }

  /**
   *
   * Envio dos pacotes já fragmentados
   * @param {*} address
   * @param {*} array
   * @param {*} i
   * @param {*} size
   * @param {*} state
   * @memberof BleTransferPage
   */
  sendData(address, array, i, size, state, characteristicUUID) {
    if (i < size - 1) {
      this.ble
        .writeWithoutResponse(address, this.puuid, characteristicUUID, array[i])
        .then(
          (x) => {
            console.log('resposta ao write ' + x);
            this.sendData(
              address,
              array,
              i + 1,
              size,
              state,
              characteristicUUID
            );
          },
          (error) => {
            if (!this.state_machine.state.context.finished) {
              this.state_machine.send({
                type: 'ERROR',
                _error: error,
                state: this.state_machine.state.value,
                _code: 'ERR_RA_010',
              });
            }
          }
        );
    } else {
      this.ble
        .writeWithoutResponse(address, this.puuid, characteristicUUID, array[i])
        .then(
          (x) => {
            console.log('resposta ao ultimo write ' + x + ', state: ' + state);
            switch (state) {
              case this.session_establish:
                this.sendToDevice(
                  address,
                  this.request,
                  this.data_session,
                  MDLServiceCharacteristics.Client2Server.uuid
                );
                break;
              case this.end_session:
                this.state_machine.send('UNSUBSCRIBE', { payload: address });
                break;
              default:
                break;
            }
          },
          (error) => {
            if (!this.state_machine.state.context.finished) {
              this.state_machine.send({
                type: 'ERROR',
                _error: error,
                state: this.state_machine.state.value,
                _code: 'ERR_RA_010',
              });
            }
          }
        );
    }
  }

  /**
   *
   * Fragmentação da mensagem e chamada do método sendData
   * @param {*} address
   * @param {*} str
   * @param {*} state
   * @memberof BleTransferPage
   */
  async sendToDevice(address, str, state, characteristicUUID) {
    let data, key, structure, string;

    switch (state) {
      case this.session_establish:
        console.log('Starting Session Establishment...');
        data = await this.encrypt_msg(str);
        console.log(data);
        key = await ComunicationCrypto.export_key(this.reader_public_key);
        structure = new DeviceEngagement.SessionEstablishment(
          GeneralMethods.b2str(CBOR.encode(key)),
          GeneralMethods.b2str(data)
        );
        string = CBOR.encode(structure);
        console.log('Session Establishment structure: ', string);
        this.act_state = this.session_establish;
        break;
      case this.end_session:
        console.log('Ending session...');
        data = await this.encrypt_msg(CBOR.encode('End Session'));
        structure = new DeviceEngagement.SessionData(
          GeneralMethods.b2str(data),
          'no error'
        );
        string = CBOR.encode(structure);
        console.log('Session Data structure to end session: ', string);
        this.act_state = this.end_session;
        break;
    }

    if (state != this.data_session) {
      const array = FragmentationMethods.splitData(string);
      console.log(string);
      string = new ArrayBuffer(0);
      this.sendData(
        address,
        array,
        0,
        array.length,
        this.act_state,
        characteristicUUID
      );
    }
  }

  /**
   * Método que termina a subscrição do serviço BLE
   */
  unsubscribe(address) {
    Promise.all([
      this.ble.stopNotification(
        address,
        this.puuid,
        MDLServiceCharacteristics.Server2Client.uuid
      ),
      this.ble.stopNotification(
        address,
        this.puuid,
        MDLServiceCharacteristics.State.uuid
      ),
    ])
      .then(() => {
        console.log('Unsubscribed bluetooth service');
        this.ble.disconnect(address).then((status) => {
          console.log(status);
          console.log('Disconnected');
          const variables = CryptoMethods.initializeSecureSessionVariables();
          this.matchEachInstanceWithVariable(variables);
        });
      })
      .catch((error) => {
        this.state_machine.send({
          type: 'ERROR',
          _error: error,
          state: this.state_machine.state.value,
          _code: 'ERR_RA_011',
        });
      });
  }

  /**
   *
   * Voltar para a página anterior
   * @memberof PeripheralPage
   */
  goBack(_event) {
    console.log("event triggered:", _event);
    this.navCtrl.navigateRoot(['/home', { user_info: 1 }]);
  }
}

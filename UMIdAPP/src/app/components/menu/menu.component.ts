import { Component, OnInit, NgZone, ChangeDetectorRef, Input } from '@angular/core';

import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

import { AlertController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import * as SecureStorage from '../../../common/general/secureStorage.js';
import { Storage } from '@ionic/storage';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  
  @Input() photo: any;
  @Input() name: any;
  @Input() userType: any;
  dataLoaded: boolean = false;
  view_name: string;
  has_back_button: boolean;
  first_name: string;

  options : InAppBrowserOptions = {
    location : 'yes',//Or 'no' 
    hidden : 'no', //Or  'yes'
    clearcache : 'yes',
    clearsessioncache : 'yes',
    zoom : 'yes',//Android only ,shows browser zoom controls 
    hardwareback : 'yes',
    mediaPlaybackRequiresUserAction : 'no',
    shouldPauseOnSuspend : 'no', //Android only 
    closebuttoncaption : 'Close', //iOS only
    disallowoverscroll : 'no', //iOS only 
    toolbar : 'yes', //iOS only 
    enableViewportScale : 'no', //iOS only 
    allowInlineMediaPlayback : 'no',//iOS only 
    presentationstyle : 'pagesheet',//iOS only    
  };

  constructor(
    private changeRef: ChangeDetectorRef,
    private ngZone: NgZone,
    public alertController: AlertController,
    private router: Router,
    private platform: Platform,
    private storage: Storage,
    private menu: MenuController,
    private iab: InAppBrowser
  ) { }

  ngOnInit(){
    this.view_name = 'Menu';
    this.has_back_button = true;
    this.dataLoaded = true;
  }


  /**
   * Funcionalidade mudar PIN
   * @memberof MenuComponent
   */
  changePIN(): void {
    this.router.navigate(['/pin-auth', { auth: true, alteration: true }]);
    this.menu.close();
  }

  /**
   * Desassocia MDL eliminando storage e SS
   *
  */
  
  disassociateStudenCard(): void {
    const ss = SecureStorage.instantiateSecureStorage();
    SecureStorage.remove('user', ss);
    SecureStorage.remove('userCertificate', ss);
    //SecureStorage.remove('root_cert_gnr', ss);
    SecureStorage.remove('root_cert_psp', ss);
    this.storage.remove('pin');
    this.storage.remove('fingerprint');
    this.router.navigate(['/instructions']);
    this.menu.close();
  }

  /**
   * Aceder ao website do IMT
   * @memberof MenuComponent
   */
  openURL(): void {
    const url = 'https://www.uminho.pt/';
    if (this.platform.is('ios')) {
      let target = "_system";
      this.iab.create(url,target,this.options);
    } else {
      let target = "_system";
      this.iab.create(url,target,this.options);
    }
  }

  goBack(){
    this.menu.close();
  }


}

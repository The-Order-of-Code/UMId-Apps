import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { MenuController } from '@ionic/angular';
import * as SecureStorage from '../../common/general/secureStorage.js';
import { Events } from '../../common/general/events';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(
    private plt: Platform,
    private router: Router,
    private storage: Storage,
    private mobileAccessibility: MobileAccessibility,
    private screenOrientation: ScreenOrientation,
    private menu: MenuController,
    public navCtrl: NavController,
    private events: Events
  ){ }

  ngOnInit() {
    this.menu.enable(false);
    this.plt.ready().then((status) => {
      this.mobileAccessibility.usePreferredTextZoom(false);
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      this.sleep(3000);
      setTimeout(() => {
          const ss = SecureStorage.instantiateSecureStorage();
          SecureStorage.get('user',ss).then((card) => {
            // check if we already did the association
            if (card) {
              // caso sim
              this.storage.get('pin').then(
                 result => {
                    if(result == null){
                      // para o caso do ios
                      SecureStorage.remove('user',ss);
                      SecureStorage.remove('userCertificate',ss);
                      this.navCtrl.navigateRoot(['/instructions']);
                    }
                    else {
                      this.events.publish('fingerprint_done', {});
                      this.navCtrl.navigateRoot(['/pin-auth', { card_info: 1 }]);
                    } 
                 },
                 error => {
                    // para o caso do ios
                    SecureStorage.remove('user',ss);
                    SecureStorage.remove('userCertificate',ss);
                    this.navCtrl.navigateRoot(['/instructions']);
                 }
              );

            } else {
              // caso contrário
              this.navCtrl.navigateRoot(['/instructions']);
            }
          }, erro => {
            this.navCtrl.navigateRoot(['/instructions']);
          });


      }, 3000);
      
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}

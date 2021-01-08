import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DarkThemeService } from '../services/dark-theme.service';
import * as SecureStorage from '../common/general/secureStorage.js';
import {NavController} from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  photo: string;
  name: string;
  userType: string;
  dataLoaded: boolean = false;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private displayMode: DarkThemeService,
    public navCtrl: NavController,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      const ss = SecureStorage.instantiateSecureStorage();
      SecureStorage.get('user', ss).then( 
        (card) => {
          const user = JSON.parse(card).user;
          this.name=user.fullName;
          this.userType=this.translate(user.userType);
          this.photo = 'data:image/jpeg;base64,' + user.picture;
          this.dataLoaded = true;
          this.displayMode.toggleDisplayMode();
          this.statusBar.styleDefault();
          this.splashScreen.hide();
        }
        );
      });
  }

  translate(type){
    switch(type){
      case 'STUDENT':
        return 'Estudante';
      case 'EMPLOYEE':
        return 'Funcionário';
      default: return '';
    }
  }
}

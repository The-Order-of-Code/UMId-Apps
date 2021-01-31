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
      this.displayMode.toggleDisplayMode();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
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

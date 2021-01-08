import { Component, OnInit } from '@angular/core';
import * as SecureStorage from '../../common/general/secureStorage.js';
import {NavController} from '@ionic/angular'; 

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
    const ss = SecureStorage.instantiateSecureStorage();
      SecureStorage.get('user', ss).then( 
        (card) => {
          this.navCtrl.navigateRoot(['/home',{ user_info: 1 }]);
        },
        err => this.navCtrl.navigateRoot(['/instructions'])
      );
  }

}

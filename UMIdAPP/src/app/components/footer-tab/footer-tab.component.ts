import { Component, OnInit, Input , Output, EventEmitter } from '@angular/core';
import * as SecureStorage from '../../../common/general/secureStorage.js';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-footer-tab',
  templateUrl: './footer-tab.component.html',
  styleUrls: ['./footer-tab.component.scss'],
})
export class FooterTabComponent implements OnInit {
  @Input() show_counter: any;
  @Input() segment: any;
  @Input() quantity: any;
  @Input() prod_name: any;
  @Input() operation_name: any;
  @Output() eventEmitter = new EventEmitter();
  constructor(public navCtrl: NavController) {}

  ngOnInit() {
    console.log(this.segment);
  }

  segmentChanged(_event){
    console.log(_event);
    switch(_event.detail.value){
      case 'home':
        this.navCtrl.navigateRoot(['/home',{user_info: 1}]);
        break;
      case 'notifications':
        this.navCtrl.navigateRoot(['/notifications']);
        break;
      case 'profile':
        const ss = SecureStorage.instantiateSecureStorage();
        SecureStorage.get('user',ss).then(
          (result) => {
            this.navCtrl.navigateRoot(['/card-page',{user: result}]);
          }
        );
        break;
      default: break;
    }
  }

  goBack(){
    this.eventEmitter.emit('back');
  }
  nextpage(){
    console.log('teste')
  }

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { FooterTabComponent } from './footer-tab/footer-tab.component';
import { CardsComponent } from './cards/cards.component';
import {PaymentsComponent} from './payments/payments.component';
import {QrcodeComponent} from './qrcode/qrcode.component';
import {SuccessComponent} from './success/success.component';
import {FailureComponent} from './failure/failure.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import {LoadingComponent} from './loading/loading.component';
import {SearchticksComponent} from './searchticks/searchticks.component';
import {CantinacardComponent} from './cantinacard/cantinacard.component';
import {SenhasComponent} from './senhas/senhas.component';

import { IonicModule } from '@ionic/angular';


@NgModule({
    imports: [CommonModule, IonicModule,NgxQRCodeModule],
    declarations: [
        FooterTabComponent,
        HeaderMenuComponent,
        CardsComponent,
        SenhasComponent,
        SearchticksComponent,
        LoadingComponent,
        CantinacardComponent,
        PaymentsComponent,
        QrcodeComponent,
        SuccessComponent,
        FailureComponent,
    ],
    exports: [
        FooterTabComponent,
        HeaderMenuComponent,
        SenhasComponent,
        SearchticksComponent,
        CardsComponent,
        CantinacardComponent,
        LoadingComponent,
        PaymentsComponent,
        QrcodeComponent,
        SuccessComponent,
        FailureComponent,
    ],
  })
  export class ComponentsModule {}
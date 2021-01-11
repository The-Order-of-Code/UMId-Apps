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
import {PermitComponent} from './permit/permit.component';
import {NotifyComponent} from './notify/notify.component';
import {InformationComponent} from './information/information.component'


import { IconsComponent } from './icons/icons.component';
import { IdCardComponent } from './id-card/id-card.component';
import { QRCodeModule } from 'angularx-qrcode';
import { IonicModule } from '@ionic/angular';


@NgModule({
    imports: [CommonModule, IonicModule, QRCodeModule],
    declarations: [
        FooterTabComponent,
        InformationComponent,
        PermitComponent,
        NotifyComponent,
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
        IconsComponent,
        QrcodeComponent,
        IdCardComponent,
    ],
    exports: [
        FooterTabComponent,
        HeaderMenuComponent,
        InformationComponent,
        PermitComponent,
        NotifyComponent,
        SenhasComponent,
        SearchticksComponent,
        CardsComponent,
        CantinacardComponent,
        LoadingComponent,
        PaymentsComponent,
        QrcodeComponent,
        SuccessComponent,
        FailureComponent,
        IconsComponent,
        QrcodeComponent,
        IdCardComponent,
    ],
  })
  export class ComponentsModule {}
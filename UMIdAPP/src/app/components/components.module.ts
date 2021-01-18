import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { FooterTabComponent } from './footer-tab/footer-tab.component';
import { CardsComponent } from './cards/cards.component';
import {QrcodeComponent} from './qrcode/qrcode.component';
import {SuccessComponent} from './success/success.component';
import {FailureComponent} from './failure/failure.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import {LoadingComponent} from './loading/loading.component';
import {CantinacardComponent} from './cantinacard/cantinacard.component';
import {PermitComponent} from './permit/permit.component';



import { IconsComponent } from './icons/icons.component';
import { IdCardComponent } from './id-card/id-card.component';
import { QRCodeModule } from 'angularx-qrcode';
import { IonicModule } from '@ionic/angular';


@NgModule({
    imports: [CommonModule, IonicModule, NgxQRCodeModule],
    declarations: [
        FooterTabComponent,
        PermitComponent,
        HeaderMenuComponent,
        CardsComponent,
        LoadingComponent,
        CantinacardComponent,
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
        PermitComponent,
        CardsComponent,
        CantinacardComponent,
        LoadingComponent,
        QrcodeComponent,
        SuccessComponent,
        FailureComponent,
        IconsComponent,
        QrcodeComponent,
        IdCardComponent,
    ],
  })
  export class ComponentsModule {}
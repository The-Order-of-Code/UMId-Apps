import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { FooterTabComponent } from './footer-tab/footer-tab.component';
import { CardsComponent } from './cards/cards.component';
import { IconsComponent } from './icons/icons.component';
import { IdCardComponent } from './id-card/id-card.component';
import { QrcodeComponent } from './qrcode/qrcode.component';
import { QRCodeModule } from 'angularx-qrcode';
import { IonicModule } from '@ionic/angular';

@NgModule({
    imports: [CommonModule, IonicModule, QRCodeModule],
    declarations: [
        FooterTabComponent,
        HeaderMenuComponent,
        CardsComponent,
        IconsComponent,
        QrcodeComponent,
        IdCardComponent,
    ],
    exports: [
        FooterTabComponent,
        HeaderMenuComponent,
        CardsComponent,
        IconsComponent,
        QrcodeComponent,
        IdCardComponent,
    ],
  })
  export class ComponentsModule {}
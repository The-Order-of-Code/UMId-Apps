import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { FooterTabComponent } from './footer-tab/footer-tab.component';
import { CardsComponent } from './cards/cards.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
    imports: [CommonModule, IonicModule],
    declarations: [
        FooterTabComponent,
        HeaderMenuComponent,
        CardsComponent,
    ],
    exports: [
        FooterTabComponent,
        HeaderMenuComponent,
        CardsComponent,
    ],
  })
  export class ComponentsModule {}
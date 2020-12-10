import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { FooterTabComponent } from './footer-tab/footer-tab.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
    imports: [CommonModule, IonicModule],
    declarations: [
        FooterTabComponent,
        HeaderMenuComponent,
    ],
    exports: [
        FooterTabComponent,
        HeaderMenuComponent,
    ],
  })
  export class ComponentsModule {}
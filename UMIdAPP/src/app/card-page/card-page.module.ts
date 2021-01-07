import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CardPagePageRoutingModule } from './card-page-routing.module';
import { ComponentsModule } from '../components/components.module';

import { CardPagePage } from './card-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    CardPagePageRoutingModule
  ],
  declarations: [CardPagePage]
})
export class CardPagePageModule {}

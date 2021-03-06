import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservePageRoutingModule } from './reserve-routing.module';
import { ComponentsModule } from '../../../components/components.module';

import { ReservePage } from './reserve.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    ReservePageRoutingModule
  ],
  declarations: [ReservePage]
})
export class ReservePageModule {}

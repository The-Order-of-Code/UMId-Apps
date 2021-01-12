import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyTicketDayPageRoutingModule } from './buy-ticket-day-routing.module';
import { ComponentsModule } from '../../../components/components.module';

import { BuyTicketDayPage } from './buy-ticket-day.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    BuyTicketDayPageRoutingModule
  ],
  declarations: [BuyTicketDayPage]
})
export class BuyTicketDayPageModule {}

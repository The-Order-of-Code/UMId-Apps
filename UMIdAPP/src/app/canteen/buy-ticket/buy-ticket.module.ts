import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyTicketPageRoutingModule } from './buy-ticket-routing.module';
import { ComponentsModule } from '../../components/components.module';

import { BuyTicketPage } from './buy-ticket.page'; 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    BuyTicketPageRoutingModule
  ],
  declarations: [BuyTicketPage]
})
export class BuyTicketPageModule {}

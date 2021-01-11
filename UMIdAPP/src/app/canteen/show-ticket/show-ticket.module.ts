import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowTicketPageRoutingModule } from './show-ticket-routing.module';
import { ComponentsModule } from '../../components/components.module';
import { ShowTicketPage } from './show-ticket.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    ShowTicketPageRoutingModule
  ],
  declarations: [ShowTicketPage]
})
export class ShowTicketPageModule {}

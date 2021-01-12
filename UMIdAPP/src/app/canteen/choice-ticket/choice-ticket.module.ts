import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChoiceTicketPageRoutingModule } from './choice-ticket-routing.module';
import { ComponentsModule } from '../../components/components.module';

import { ChoiceTicketPage } from './choice-ticket.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    ChoiceTicketPageRoutingModule
  ],
  declarations: [ChoiceTicketPage]
})
export class ChoiceTicketPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchTicketPageRoutingModule } from './search-ticket-routing.module';
import { ComponentsModule } from '../../components/components.module';

import { SearchTicketPage } from './search-ticket.page';

@NgModule({ 
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    SearchTicketPageRoutingModule
  ], 
  declarations: [SearchTicketPage]
})
export class SearchTicketPageModule {}

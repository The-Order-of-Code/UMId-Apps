import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NextReservationsPageRoutingModule } from './next-reservations-routing.module';
import { ComponentsModule } from '../../components/components.module';
import { NextReservationsPage } from './next-reservations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    NextReservationsPageRoutingModule
  ],
  declarations: [NextReservationsPage]
})
export class NextReservationsPageModule {}

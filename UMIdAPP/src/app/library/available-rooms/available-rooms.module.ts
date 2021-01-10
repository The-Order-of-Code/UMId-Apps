import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AvailableRoomsPageRoutingModule } from './available-rooms-routing.module';
import { ComponentsModule } from '../../components/components.module';

import { AvailableRoomsPage } from './available-rooms.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    AvailableRoomsPageRoutingModule
  ],
  declarations: [AvailableRoomsPage]
})
export class AvailableRoomsPageModule {}

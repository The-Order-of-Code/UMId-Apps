import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HolderBleTransferPageRoutingModule } from './holder-ble-transfer-routing.module';
import { ComponentsModule } from '../../components/components.module';
import { HolderBleTransferPage } from './holder-ble-transfer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    HolderBleTransferPageRoutingModule
  ],
  declarations: [HolderBleTransferPage]
})
export class HolderBleTransferPageModule {}

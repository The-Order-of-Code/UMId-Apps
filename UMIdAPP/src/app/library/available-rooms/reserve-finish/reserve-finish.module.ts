import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReserveFinishPageRoutingModule } from './reserve-finish-routing.module';
import { ComponentsModule } from '../../../components/components.module';
import { ReserveFinishPage } from './reserve-finish.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    ReserveFinishPageRoutingModule
  ],
  declarations: [ReserveFinishPage]
})
export class ReserveFinishPageModule {}

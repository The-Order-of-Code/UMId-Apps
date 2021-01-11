import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentsFinishPageRoutingModule } from './payments-finish-routing.module';
import { ComponentsModule } from '../components/components.module';

import { PaymentsFinishPage } from './payments-finish.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    PaymentsFinishPageRoutingModule
  ],
  declarations: [PaymentsFinishPage]
})
export class PaymentsFinishPageModule {}

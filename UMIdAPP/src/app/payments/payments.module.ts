import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentsPageRoutingModule } from './payments-routing.module';
import { ComponentsModule } from '../components/components.module';

import { PaymentsPage } from './payments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    PaymentsPageRoutingModule
  ],
  declarations: [PaymentsPage]
})
export class PaymentsPageModule {}

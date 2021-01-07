import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PinAuthPageRoutingModule } from './pin-auth-routing.module';

import { PinAuthPage } from './pin-auth.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PinAuthPageRoutingModule
  ],
  declarations: [PinAuthPage]
})
export class PinAuthPageModule {}

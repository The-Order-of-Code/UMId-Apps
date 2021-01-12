import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformationPageRoutingModule } from './information-routing.module';
import { ComponentsModule } from '../../../components/components.module';

import { InformationPage } from './information.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    InformationPageRoutingModule
  ],
  declarations: [InformationPage]
})
export class InformationPageModule {}

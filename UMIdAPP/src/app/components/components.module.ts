import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderMenuComponent } from './header-menu/header-menu.component';

@NgModule({
    imports: [CommonModule],
    declarations: [
        HeaderMenuComponent,
    ],
    exports: [
        HeaderMenuComponent,
    ],
  })
  export class ComponentsModule {}
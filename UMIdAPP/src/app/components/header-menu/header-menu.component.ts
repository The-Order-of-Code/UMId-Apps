import { Component, OnInit, Input , Output, EventEmitter } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit {

  @Input() title: any;
  @Input() has_back_button: any;
  @Input() username: any;
  @Output() goback = new EventEmitter();
  constructor(private menu: MenuController) { }

  ngOnInit() {
    console.log(this.title);
  }

  openMenu() {
    this.menu.open();
  }


  goBack(){
    this.goback.emit('back');
  }

}

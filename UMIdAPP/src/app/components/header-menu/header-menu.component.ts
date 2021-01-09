import { Component, OnInit, Input , Output, EventEmitter } from '@angular/core';

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
  constructor() { }

  ngOnInit() {
    console.log(this.title);
  }

  goBack(){
    this.goback.emit('back');
  }

}

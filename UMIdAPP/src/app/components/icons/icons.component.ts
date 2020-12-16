import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss'],
})
export class IconsComponent implements OnInit {
  @Input() icon_name: any;
  @Output() output = new EventEmitter<string>();
  constructor() {
  }

  ngOnInit() {

  }

  childMsg() {
    this.output.emit('done')
  }

}

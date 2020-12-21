import { Component, OnInit, Input , Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-footer-tab',
  templateUrl: './footer-tab.component.html',
  styleUrls: ['./footer-tab.component.scss'],
})
export class FooterTabComponent implements OnInit {
  @Input() show_counter: any;
  @Input() quantity: any;
  @Input() prod_name: any;
  @Input() operation_name: any;
  @Output() eventEmitter = new EventEmitter();
  constructor() {}

  ngOnInit() {
    
  }

  goBack(){
    this.eventEmitter.emit('back');
  }

}

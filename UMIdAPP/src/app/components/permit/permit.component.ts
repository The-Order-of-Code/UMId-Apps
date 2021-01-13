import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-permit',
  templateUrl: './permit.component.html',
  styleUrls: ['./permit.component.scss'],
})
export class PermitComponent implements OnInit {
  @Input() info:any;
  @Input() sub_info:any;
  @Input() shared_other:boolean;
  @Input() request_attributes:  Array<string>;
  @Input() icon_name:any;
  @Output() eventEmitter = new EventEmitter();
  @Output() nextPageEventEmitter = new EventEmitter();

  constructor() { }

  ngOnInit() {
    
    console.log('Show component attributes',this.request_attributes)
    console.log('Show componentt info ',this.info)
    console.log('Show componentt sub_info ',this.sub_info)
    console.log('Show componentt shared ',this.shared_other)
    console.log('Show componentt icon ',this.icon_name)
    

  }

  nextPage(ev, item) {
    console.log("item", item);
    if (item.args) {
      this.nextPageEventEmitter.emit(JSON.stringify({ url: item.url, args: item.args }));
    }
    else this.nextPageEventEmitter.emit(JSON.stringify({ url: item.url }));
  }

  goBack() {
    this.eventEmitter.emit('back');
  }


}

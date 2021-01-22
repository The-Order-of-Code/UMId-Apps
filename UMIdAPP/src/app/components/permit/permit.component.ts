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
  @Output() refused = new EventEmitter();
  @Output() accepted = new EventEmitter();


  constructor() { }

  ngOnInit() {
    
    console.log('Show component attributes',this.request_attributes)
    console.log('Show componentt info ',this.info)
    console.log('Show componentt sub_info ',this.sub_info)
    console.log('Show componentt shared ',this.shared_other)
    console.log('Show componentt icon ',this.icon_name)
    

  }


  refuse(): void {
    this.refused.emit('refused');
  }

  accept(): void {
    this.accepted.emit('accepted');
  }

}

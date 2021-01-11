import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit {
  @Input() text_pay: string;
  @Input() total_value: any;
  @Input() title_description: string;
  @Input() title_count: string;
  @Input() title_value: string;
  @Input() items: any;

  @Input() text_select: any;
  @Output() eventEmitter = new EventEmitter();
  constructor() {



  }

  ngOnInit() {

  }

  goBack() {
    this.eventEmitter.emit('back');
  }
}

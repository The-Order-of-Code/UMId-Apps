import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-failure',
  templateUrl: './failure.component.html',
  styleUrls: ['./failure.component.scss'],
})
export class FailureComponent {
  @Input() icon_name: any;
  @Input() failure_quote: string;
  @Output() goback = new EventEmitter();
  @Input() failure_code: string;
  failure_code_show = false;

  ngOnInit(){
    console.log(this.icon_name);
  }

  goBack(): void {
    this.goback.emit('voltar');
  }
}

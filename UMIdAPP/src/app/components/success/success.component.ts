import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
})
export class SuccessComponent {
  @Input() icon_name: string;
  @Input() success_quote: string;
  @Output() goback = new EventEmitter();

  goBack(): void {
    this.goback.emit('back');
  }
}
 
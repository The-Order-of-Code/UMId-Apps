import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss'],
})
export class NotifyComponent implements OnInit {
  @Input() items:any;
  @Input() card_type:any;

  constructor() { }

  ngOnInit() {}

}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-permit',
  templateUrl: './permit.component.html',
  styleUrls: ['./permit.component.scss'],
})
export class PermitComponent implements OnInit {
  @Input() info:any;
  @Input() sub_info:any;
  @Input() icon_name:any;

  constructor() { }

  ngOnInit() {}

}

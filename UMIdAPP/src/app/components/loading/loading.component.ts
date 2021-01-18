import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  @Input() icon_name: any;
  @Input() message: any;

  constructor() { 
    console.log(this.message)
  }

  ngOnInit() {}

}

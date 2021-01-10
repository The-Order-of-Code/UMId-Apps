import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-senhas',
  templateUrl: './senhas.component.html',
  styleUrls: ['./senhas.component.scss'],
})
export class SenhasComponent {
  @Input() items:any;
  @Input() card_type:any;
  
  

  constructor() { }

 



}

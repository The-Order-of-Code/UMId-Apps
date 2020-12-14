import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss'],
})
export class QrcodeComponent implements OnInit{
  
  
  @Input() createdCode: any;
  @Input() title: string;

  constructor(){
    console.log(this.createdCode);
  }

  ngOnInit(){}
  

}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss'],
})
export class QrcodeComponent implements OnInit {
  
  sentence: string;
  width: number;
  @Input() data_name: any;
  @Input() createdCode: any;

  constructor() {}

  ngOnInit() {
    this.width = window.innerWidth;
    console.log(typeof(this.createdCode));
    this.sentence = "Utilize o código QR Code para  utilizar a sua " + this.data_name;
    console.log('qrcode component: ' + this.createdCode + this.sentence);
  }

}

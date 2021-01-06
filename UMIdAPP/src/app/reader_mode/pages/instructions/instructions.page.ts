import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.page.html',
  styleUrls: ['./instructions.page.scss'],
})
export class InstructionsPage implements OnInit {

  constructor(private router: Router, private menu: MenuController) { }

  ngOnInit() {
    this.menu.enable(false);
  }


  /**
   * Avançar para a próxima página
   * @memberof InstructionsPage
   */
  moveForward(): void {
    this.router.navigate(['/pin-auth']);
  }


}

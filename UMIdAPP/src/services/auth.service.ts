import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import * as consts from 'src/common/general/constants';
@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http: HTTP) { }

  /**
   * Realiza o login a aplicação
   *
   * @param {string} number_student
   * @param {string} password
   * @return {*} 
   * @memberof AuthService
   */
  login(number_student: string, password: string, csr: string) {
    this.http.setServerTrustMode('default');
    this.http.useBasicAuth(number_student, password);
    this.http.setDataSerializer('json');

    return this.http.post(

      consts.auth_url,
      {
        csr: csr,
      },
      {}
    );
  }

  buyTickets(username: string, password: string, tickets) {
    this.http.setServerTrustMode('default');
    this.http.useBasicAuth(username, password); 
    this.http.setDataSerializer('json');
    return this.http.post(
      consts.add_tickets,
      tickets,
      {}
    );
  }

}

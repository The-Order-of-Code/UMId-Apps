import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import * as consts from 'src/common/general/constants';
@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http: HTTP) {}
  
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
    // this.http.setHeader('*', 'Access-Control-Allow-Origin', '*');
    // this.http.setHeader(
    //   '*',
    //   'Access-Control-Allow-Methods',
    //   'POST, GET, OPTIONS, PUT'
    // );
    // this.http.setHeader('*', 'Accept', 'application/json');
    // this.http.setHeader('*', 'content-type', 'application/json');

    this.http.setDataSerializer('json');

    return this.http.post(
      
      consts.auth_url,
      {
        csr:csr,
      },
      {}
    );
  }

}

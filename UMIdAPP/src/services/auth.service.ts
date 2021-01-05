import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http: HTTP,  private storage: Storage) {}
  
  /**
   * Realiza o login a aplicação
   *
   * @param {string} number_student
   * @param {string} password
   * @return {*} 
   * @memberof AuthService
   */
  login(number_student: string, password: string) {
    this.http.setServerTrustMode('default');
    this.http.setHeader('*', 'Access-Control-Allow-Origin', '*');
    this.http.setHeader(
      '*',
      'Access-Control-Allow-Methods',
      'POST, GET, OPTIONS, PUT'
    );
    this.http.setHeader('*', 'Accept', 'application/json');
    this.http.setHeader('*', 'content-type', 'application/json');

    this.http.setDataSerializer('json');

    return this.http.post(
      
      'http://127.0.0.1:8000/general/all/',
      {
        username: number_student,
        password: password,
        issuer: 'Simulated',
      },
      {}
    );
  }

}

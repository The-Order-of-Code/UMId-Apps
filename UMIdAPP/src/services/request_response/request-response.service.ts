import { Injectable } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { FieldsRequested } from '../../common/interfaces/reader-mode/fields-requested';
import { Response } from '../../common/interfaces/reader-mode/response';
import { Request } from '../../common/interfaces/reader-mode/request';
import * as GeneralMethods from '../../common/general/reader-mode/general';
import * as SecureStorage from '../../common/general/secureStorage.js';
import * as pkijs from 'pkijs';
import * as consts from '../../common/general/constants'

@Injectable({
  providedIn: 'root',
})
export class RequestResponseService {
  url = 'http://'+ consts.ip_backend + '/general/attributes/';
  urlTickets = 'http://'+ consts.ip_backend + '/cafeteria/validateTicket'
  constructor(private http: HTTP) {}

  /**
   * Método de buscar o cartão a partir do token recebido da
   * qr lido na app.
   *
   * @param {FieldsRequested} fieldsRequested requisitos que se quer ler
   * @param {string} token token recebido pela carta
   * @return {*}  {Promise<HTTPResponse>}
   * @memberof RequestResponseService
   */
  getMDL(
    token: string
  ): Promise<HTTPResponse> {
    this.http.setServerTrustMode('default');
    this.http.setHeader('*', 'Access-Control-Allow-Origin', '*');
    this.http.setHeader(
      '*',
      'Access-Control-Allow-Methods',
      'POST, GET, OPTIONS, PUT'
    );
    this.http.setHeader('*', 'Accept', 'application/json');
    this.http.setHeader('*', 'content-type', 'application/json');
    this.http.useBasicAuth('f3233','lourenco1234')
    this.http.setDataSerializer('json');
    console.log(token); 
    const body = {
      token: token,
    };

    console.log('body ', JSON.stringify(body));

    return this.http.post(this.url, body, {});
  }

  /**
   * Método para tratar a resposta da requisição de leitura da carta pelo
   * token
   *
   * @param {HTTPResponse} jwt
   * @param {string} request_flag
   * @return {*}
   * @memberof RequestResponseService
   */
  async treatResponse(response, request_flag: string) {
    const responseData = JSON.parse(response);
    console.log('response', responseData);
    let obj
    if (request_flag == '0') obj = GeneralMethods.userResponseToUserBackend(responseData); 
    console.log(obj)
    return JSON.stringify(obj);
  }

  validateTicket(
    token: string
  ): Promise<HTTPResponse> {
    this.http.setServerTrustMode('default');
    this.http.setHeader('*', 'Access-Control-Allow-Origin', '*');
    this.http.setHeader(
      '*',
      'Access-Control-Allow-Methods',
      'POST, GET, OPTIONS, PUT'
    );
    this.http.setHeader('*', 'Accept', 'application/json');
    this.http.setHeader('*', 'content-type', 'application/json');
    this.http.useBasicAuth('f3233','lourenco1234')
    this.http.setDataSerializer('json');
    console.log(token); 
    const body = {
      employeeUsername: 'f3233',
      token: token
    };

    console.log('body ', JSON.stringify(body));

    return this.http.post(this.urlTickets, body, {});
  }

}
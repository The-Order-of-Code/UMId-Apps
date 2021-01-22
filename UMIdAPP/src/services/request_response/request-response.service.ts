import { Injectable } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import * as GeneralMethods from '../../common/general/reader-mode/general';
import * as pkijs from 'pkijs';
import * as consts from '../../common/general/constants';

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
    console.log(response);
    const verifiedCertChain = await this.verifyCertificateChain(response);
    const sign_verified = await this.verifyJWTSignature(response);
    
    if(verifiedCertChain && sign_verified){
      const responseData = this.parseJwt(response);
      console.log('response', responseData);
      let obj
      if (request_flag == '0') obj = GeneralMethods.userResponseToUserBackend(responseData); 
      console.log(obj)
      return JSON.stringify(obj);
    }
    else return null;
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

  parseHeader(token){
    const base64Url = token.split('.')[0];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(Buffer.from(base64, 'base64').toString('binary'));
  }

  parseSignature(token){
    const base64Url = token.split('.')[2];
    console.log('base64UrlSig: ', base64Url)
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');;
    return base64;
  }

  parseJwt (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(Buffer.from(base64, 'base64').toString('binary'));
  }


  async verifyCertificateChain(jwt) {
    const payload = this.parseJwt(jwt);
    console.log(typeof(payload.certificate))
    const iaCertPEM = payload.certificate;
    const iaCert = GeneralMethods.decodeCert(iaCertPEM);
    const rootCert = GeneralMethods.decodeCert(consts.root_cert_pem);
    const trustedCertificates = [];
    const certificates_to_verify = [];
    const crls = [];
    trustedCertificates.push(rootCert);
    certificates_to_verify.push(iaCert);
    const certChainVerificationEngine = new pkijs.CertificateChainValidationEngine(
      {
        trustedCerts: trustedCertificates,
        certs: certificates_to_verify,
        crls,
      }
    );

    const verifyCertChain = await certChainVerificationEngine.verify();

    return verifyCertChain.result;
  }

  async verifyJWTSignature(response){
    const jwt = JSON.parse(response);
    console.log(jwt)
    const header = this.parseHeader(jwt);
    const signature = this.parseSignature(jwt)
    const payload = this.parseJwt(jwt)
    const alg = header.alg;
    const jwsSigningInput = jwt.split('.').slice(0, 2).join('.')
    const encoded_signature = jwt.split('.')[2];
    const iaCertPEM = payload.certificate;
    const iaCert = GeneralMethods.decodeCert(iaCertPEM);
    const pubKeyIA = iaCert.subjectPublicKeyInfo.toJSON();
    
    const matchAlgToNameDigest = {
      'ES256': { 
        'import': { name: 'ECDSA',
          namedCurve: 'P-256',
          hash: {name: 'SHA-256'}
        }, 'verify': { name: 'ECDSA', 
          hash: {name: 'SHA-256'} 
        } 
      },
      'ES384': { 
        'import': { name: 'ECDSA',
          namedCurve: 'P-384',
          hash: {name: 'SHA-384'},
        }, 'verify': { name: 'ECDSA', 
          hash: {name: 'SHA-384'} 
        } 
      },
      'ES512': { 
        'import': { name: 'ECDSA',
          namedCurve: 'P-512',
          hash: {name: 'SHA-512'},
        }, 'verify': { name: 'ECDSA', 
          hash: {name: 'SHA-512'} 
        } 
      },
      'RS256': {
        'import': { 
          name: 'RSASSA-PKCS1-v1_5', 
          hash: { name: 'SHA-256' } 
        },
        'verify': { name: 'RSASSA-PKCS1-v1_5' }
      },
      'RS384': {
        'import': { 
          name: 'RSASSA-PKCS1-v1_5', 
          hash: { name: 'SHA-384' } 
        },
        'verify': { name: 'RSASSA-PKCS1-v1_5' }
      },
      'RS512': {
        'import': { 
          name: 'RSASSA-PKCS1-v1_5', 
          hash: { name: 'SHA-512' } 
        },
        'verify': { name: 'RSASSA-PKCS1-v1_5' }
      },
      'PS256': {
        'import': {   
          name: 'RSA-PSS',
          hash: {name: 'SHA-256'}, 
        },
        'verify': {
          name: 'RSA-PSS',
          saltLength: 128, //the length of the salt (we need to adapt 
          // that salt length according to salt used to sign the token!)
        }
      },
      'PS384': {
        'import': {   
          name: 'RSA-PSS',
          hash: {name: 'SHA-384'}, 
        },
        'verify': {
          name: 'RSA-PSS',
          saltLength: 128, //the length of the salt (we need to adapt 
          // that salt length according to salt used to sign the token!)
        }
      },
      'PS512': {
        'import': {   
          name: 'RSA-PSS',
          hash: {name: 'SHA-512'}, 
        },
        'verify': {
          name: 'RSA-PSS',
          saltLength: 128, //the length of the salt (we need to adapt 
          // that salt length according to salt used to sign the token!)
        }
      },
    }; 
    
    const key = await crypto.subtle.importKey('jwk', pubKeyIA, matchAlgToNameDigest[alg].import, false, ['verify'])
  
    const verify = await crypto.subtle.verify(
      matchAlgToNameDigest[alg].verify, 
      key, 
      Buffer.from(signature,'base64').buffer,
      new TextEncoder().encode(jwsSigningInput)
    );

    return verify
  }


}

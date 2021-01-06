import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';

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
  login(number_student: string, password: string) {
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
    const csr = "-----BEGIN CERTIFICATE REQUEST-----\n"  +
      "MIIBJTCBzAIBADBqMQswCQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEW\n"  +
      "MBQGA1UEBxMNU2FuIEZyYW5jaXNjbzEUMBIGA1UEChMLZXhhbXBsZS5jb20xGDAW\n" +
      "BgNVBAMTD3d3dy5leGFtcGxlLmNvbTBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IA\n" +
      "BFt/Nxf9z/4/3HVoP93NJD2GYSOHClTYhcbTAR8pWINN3T5SSL2PQTxkqcQP3s4z\n" +
      "0Jl/SmROVKtvoCl8+J3dJqSgADAKBggqhkjOPQQDAgNIADBFAiEAz1xsa9caHgvf\n" +
      "tds/jp739DLYH2+Ai9V30PGs1Onpo9YCIDwHI79FJESXh40MhH55jik2ZKmccgyz\n" +
      "dGf0h1QsoyRJ\n" +
      "-----END CERTIFICATE REQUEST-----\n";
    

    this.http.setDataSerializer('json');

    return this.http.post(
      
      'http://127.0.0.1:8000/general/all/',
      {
        csr:csr,
      },
      {}
    );
  }

}

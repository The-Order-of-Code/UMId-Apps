import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import * as consts from 'src/common/general/constants';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  constructor(private http: HTTP) { }

  getFreeRoom(username, password){
    this.http.setServerTrustMode('default');
    this.http.useBasicAuth(username, password);
    this.http.setDataSerializer('json');
    return this.http.get(consts.free_rooms,{},{});
  }

  getFreeTime(username, password,idRoom){
    this.http.setServerTrustMode('default');
    this.http.useBasicAuth(username, password);
    this.http.setDataSerializer('json');
    return this.http.post(consts.free_times,{id:idRoom},{});
  }


}

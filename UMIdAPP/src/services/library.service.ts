import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import * as consts from 'src/common/general/constants';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  constructor(private http: HTTP) { }

  setCredentials(username, password){
    this.http.setServerTrustMode('default');
    this.http.useBasicAuth(username, password);
    this.http.setDataSerializer('json');
  }

  getFreeRoom(username, password){
    this.setCredentials(username, password);
    return this.http.get(consts.free_rooms,{},{});
  }

  getFreeTime(username, password,idRoom){
    this.setCredentials(username, password);
    return this.http.post(consts.free_times,{id:idRoom},{});
  }

  getOneRoom(username,password,id){
    this.setCredentials(username, password);
    return this.http.get(consts.room+id,{},{})
  }

  getOneResavation(username,password,id){
    this.setCredentials(username, password);
    return this.http.get(consts.room+id,{},{})
  } 

  deleteReservation(username,password,id){
    this.setCredentials(username, password);
    return this.http.delete(consts.reservations+id,{},{})
  }


}

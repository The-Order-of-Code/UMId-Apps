import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import * as consts from 'src/common/general/constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  constructor(private http: HTTP, private httpClient: HttpClient) { }

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
    const httpOptions = {
      method: "delete",
    };
    return this.http.sendRequest(consts.reservations+id,{method: "delete" })
  }

  makeReservation(username,password,reservation){
    this.setCredentials(username, password);
    return this.http.post(consts.reservations,reservation,{});
  }

  treatReservations(reservations){
    reservations.forEach(x => x['check-in'] = false);
  }

  getNextReservations(reservations){
    reservations.sort((a, b) => new Date(b['start']).getTime() - new Date(a['start']).getTime()).filter(x => new Date(x['start']).getTime() >= new Date().getTime());
  }

  getCheckInReservations(reservations){
    this.getNextReservations(reservations);
    let date = new Date().getTime();
    reservations.filter(
      x => {
        if (x['check-in'] == false 
        && (new Date(x['start']).getTime() - date) <= 900000
        && (new Date(x['start']).getTime() - date) >= -300000){ return x }
      }
    );
    console.log(reservations);
  }

  getCheckOutReservations(reservations){
    this.getNextReservations(reservations);
    let date = new Date().getTime();
    reservations.filter(
      x => {
        if (x['check-in'] == true 
        && (new Date(x['begin_date']).getTime() - date) >= -300000){ return x }
      });
    
  }


}

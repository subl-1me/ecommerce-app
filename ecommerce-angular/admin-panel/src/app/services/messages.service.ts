import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { constans } from './const';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(
    private _http: HttpClient
  ) { }

  public getMessages():Observable<any>{

    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(constans.url+'messages', {headers: headers});
  }

  public closeMessage(id:string):Observable<any>{
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.put(constans.url+'message/'+id, {headers: headers});

  }
}

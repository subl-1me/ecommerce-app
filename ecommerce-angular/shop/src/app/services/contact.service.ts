import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


import { GLOBAL } from './CONST';

import { Contact } from '../models/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(
    private _http: HttpClient
  ) { }

  public createContactMessage(contact: Contact):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(GLOBAL.url+'message', contact, {headers: headers});
  }
}

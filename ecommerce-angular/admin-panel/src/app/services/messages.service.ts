import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { constans } from './const';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  constructor(private _http: HttpClient) {}

  public getMessages(): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(
      (environment.API_URL || constans.defaultUrl) + 'messages',
      { headers: headers }
    );
  }

  public closeMessage(id: string): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.put(
      (environment.API_URL || constans.defaultUrl) + 'message/' + id,
      { headers: headers }
    );
  }
}

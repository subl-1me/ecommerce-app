import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GLOBAL } from './CONST';

@Injectable({
  providedIn: 'root',
})
export class DirectionService {
  constructor(private _http: HttpClient) {}

  addDirection(direction: any): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(GLOBAL.url + 'direction', direction, {
      headers: headers,
    });
  }

  getDirectionList(): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(GLOBAL.url + 'directions', { headers: headers });
  }

  deleteDirection(directionID: string): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.delete(GLOBAL.url + 'direction/' + directionID, {
      headers: headers,
    });
  }

  setDirectionAsDefault(
    directionID: string,
    customerID: string
  ): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.put(
      GLOBAL.url + 'direction/' + directionID + '/' + customerID,
      { headers: headers }
    );
  }

  getDefaultDirection(customerID: string): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(GLOBAL.url + 'defaultDirection/' + customerID, {
      headers: headers,
    });
  }
}

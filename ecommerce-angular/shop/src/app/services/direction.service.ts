import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GLOBAL } from './CONST';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DirectionService {
  constructor(private _http: HttpClient) {}

  addDirection(direction: any): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(
      environment.API_URL || GLOBAL.localUrl + 'direction',
      direction,
      {
        headers: headers,
      }
    );
  }

  getDirectionList(): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(
      environment.API_URL || GLOBAL.localUrl + 'directions',
      { headers: headers }
    );
  }

  deleteDirection(directionID: string): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.delete(
      environment.API_URL || GLOBAL.localUrl + 'direction/' + directionID,
      {
        headers: headers,
      }
    );
  }

  setDirectionAsDefault(
    directionID: string,
    customerID: string
  ): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.put(
      environment.API_URL ||
        GLOBAL.localUrl + 'direction/' + directionID + '/' + customerID,
      { headers: headers }
    );
  }

  getDefaultDirection(customerID: string): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(
      environment.API_URL || GLOBAL.localUrl + 'defaultDirection/' + customerID,
      {
        headers: headers,
      }
    );
  }
}

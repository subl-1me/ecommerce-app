import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GLOBAL } from './CONST';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DirectionService {
  private httpHeaders: HttpHeaders = new HttpHeaders().set(
    'Content-Type',
    'application/json',
  );
  constructor(private _http: HttpClient) {}

  public addDirection(direction: any): Observable<any> {
    return this._http.post(
      (environment.API_URL || GLOBAL.localUrl) + 'direction',
      direction,
      {
        headers: this.httpHeaders,
      },
    );
  }

  public getDirectionList(): Observable<any> {
    return this._http.get(
      (environment.API_URL || GLOBAL.localUrl) + 'directions',
      { headers: this.httpHeaders },
    );
  }

  public deleteDirection(directionID: string): Observable<any> {
    return this._http.delete(
      (environment.API_URL || GLOBAL.localUrl) + 'direction/' + directionID,
      {
        headers: this.httpHeaders,
      },
    );
  }

  public setDirectionAsDefault(
    directionID: string,
    customerID: string,
  ): Observable<any> {
    return this._http.put(
      environment.API_URL ||
        GLOBAL.localUrl + 'direction/' + directionID + '/' + customerID,
      { headers: this.httpHeaders },
    );
  }

  public getDefaultAddress(customerID: string): Observable<any> {
    return this._http.get(
      (environment.API_URL || GLOBAL.localUrl) +
        'defaultDirection/' +
        customerID,
      {
        headers: this.httpHeaders,
      },
    );
  }
}
